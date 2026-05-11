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
            const project = projectMap[notif.payload?.project_id]
            const sender = senderMap[notif.payload?.sender_id]
            const offer = offerMap[`${notif.payload?.project_id}:${notif.payload?.sender_id}`]
            const requiredSkills = project?.required_skills || []
            const matchedSkills = requiredSkills.filter((s) => mySkills.has(s))

            return (
              <div key={notif.id} className="card p-6 space-y-4 border-l-4 border-indigo-500">
                <div className="flex items-start gap-3">
                  <Avatar src={sender?.avatar_url} name={sender?.full_name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Perfect Match
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg leading-tight">
                      {project?.title || 'Untitled Project'}
                    </h3>
                    <p className="text-slate-600 text-sm mt-1 line-clamp-2">
                      {project?.description}
                    </p>
                  </div>
                </div>

                {matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    <span className="text-xs text-slate-400 self-center ml-1">
                      matched skill{matchedSkills.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}

                {offer ? (
                  <div className="flex gap-3 pt-1">
                    <form action={respondToOffer}>
                      <input type="hidden" name="offer_id" value={offer.id} />
                      <input type="hidden" name="decision" value="accepted" />
                      <button className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Accept
                      </button>
                    </form>
                    <form action={respondToOffer}>
                      <input type="hidden" name="offer_id" value={offer.id} />
                      <input type="hidden" name="decision" value="declined" />
                      <button className="px-5 py-2 rounded-xl border text-sm font-medium hover:bg-slate-50 transition-colors">
                        Decline
                      </button>
                    </form>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 pt-1">Offer details unavailable</p>
                )}
              </div>
            )
          })}
        </section>
      )}

      {past.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Past</h2>
          {past.map((notif) => {
            const project = projectMap[notif.payload?.project_id]
            const offer = offerMap[`${notif.payload?.project_id}:${notif.payload?.sender_id}`]
            const requiredSkills = project?.required_skills || []
            const matchedSkills = requiredSkills.filter((s) => mySkills.has(s))

            return (
              <div key={notif.id} className="card p-5 space-y-2 opacity-70">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{project?.title || 'Untitled Project'}</h3>
                  {offer && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        offer.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {offer.status}
                    </span>
                  )}
                </div>
                {matchedSkills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
