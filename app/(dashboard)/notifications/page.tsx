import { createClient } from '@/utils/supabase/server'
import { respondToOffer } from './actions'
import Avatar from '@/app/components/common/Avatar'

type NotificationRow = {
  id: string
  type: string
  payload: { project_id: string; sender_id: string }
  read_at: string | null
  created_at: string
}

type ProjectRow = {
  id: string
  title: string
  description: string
  required_skills: string[]
}

type OfferRow = {
  id: string
  status: string
  project_id: string
  sender_id: string
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Source of truth: notifications table (same source as the badge)
  const { data: notificationsRaw } = await supabase
    .from('notifications')
    .select('id, type, payload, read_at, created_at')
    .eq('user_id', user.id)
    .eq('type', 'offer_received')
    .order('created_at', { ascending: false })

  const notifications = (notificationsRaw || []) as NotificationRow[]

  // Mark all unread notifications as read now that the user is viewing the page
  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .is('read_at', null)

  // Collect unique project_ids and sender_ids from payloads
  const projectIds = [...new Set(notifications.map((n) => n.payload?.project_id).filter(Boolean))]
  const senderIds = [...new Set(notifications.map((n) => n.payload?.sender_id).filter(Boolean))]

  // Fetch projects
  const { data: projectsRaw } = projectIds.length
    ? await supabase
        .from('projects')
        .select('id, title, description, required_skills')
        .in('id', projectIds)
    : { data: [] }

  const projectMap: Record<string, ProjectRow> = {}
  for (const p of projectsRaw || []) {
    projectMap[p.id] = p
  }

  // Fetch sender profiles
  const { data: senderProfilesRaw } = senderIds.length
    ? await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', senderIds)
    : { data: [] }

  const senderMap: Record<string, { full_name: string | null; avatar_url: string | null }> = {}
  for (const p of senderProfilesRaw || []) {
    senderMap[p.id] = p
  }

  // Fetch corresponding offers so we can Accept/Decline
  const { data: offersRaw } = projectIds.length
    ? await supabase
        .from('offers')
        .select('id, status, project_id, sender_id')
        .eq('receiver_id', user.id)
        .in('project_id', projectIds)
    : { data: [] }

  // Key: `${project_id}:${sender_id}` → offer
  const offerMap: Record<string, OfferRow> = {}
  for (const o of (offersRaw || []) as OfferRow[]) {
    offerMap[`${o.project_id}:${o.sender_id}`] = o
  }

  // Current user's skills for match overlap display
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('skills')
    .eq('id', user.id)
    .single()

  const mySkills = new Set((myProfile?.skills || []) as string[])

  const pending = notifications.filter((n) => {
    const offer = offerMap[`${n.payload?.project_id}:${n.payload?.sender_id}`]
    return !offer || offer.status === 'pending'
  })

  const past = notifications.filter((n) => {
    const offer = offerMap[`${n.payload?.project_id}:${n.payload?.sender_id}`]
    return offer && offer.status !== 'pending'
  })

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">Signals</h1>

      {notifications.length === 0 && (
        <div className="card p-8 text-center text-slate-500">
          No notifications yet — complete your profile with skills to get matched!
        </div>
      )}

      {pending.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            New · {pending.length}
          </h2>
          {pending.map((notif) => {
            const proj
