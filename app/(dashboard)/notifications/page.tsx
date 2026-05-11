import { createClient } from '@/utils/supabase/server'
import { respondToOffer } from './actions'
import Avatar from '@/app/components/common/Avatar'
import Link from 'next/link'

type OfferRecord = {
  id: string
  status: string
  sender_id: string
  projects: { title: string; description: string }[] | null
}

type ConversationRecord = {
  id: string
  participant_a: string
  participant_b: string
  last_message_at: string | null
  other_user: {
    id: string
    full_name: string | null
    avatar_url: string | null
  } | null
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: offers }, { data: conversationsRaw }] = await Promise.all([
    user
      ? supabase
          .from('offers')
          .select('id,status,sender_id,projects(title,description)')
          .eq('receiver_id', user.id)
          .order('created_at', { ascending: false })
      : { data: [] },
    user
      ? supabase
          .from('conversations')
          .select('id,participant_a,participant_b,last_message_at')
          .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
          .order('last_message_at', { ascending: false, nullsFirst: false })
          .limit(20)
      : { data: [] },
  ])

  const conversations = (conversationsRaw || []) as ConversationRecord[]

  const otherUserIds = conversations.map((c) =>
    c.participant_a === user?.id ? c.participant_b : c.participant_a
  )

  const { data: otherProfiles } = otherUserIds.length
    ? await supabase
        .from('profiles')
        .select('id,full_name,avatar_url')
        .in('id', otherUserIds)
    : { data: [] }

  const profileMap: Record<string, { full_name: string | null; avatar_url: string | null }> = {}
  for (const p of otherProfiles || []) {
    profileMap[p.id] = p
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">Signals</h1>

      {conversations.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Messages</h2>
          <div className="grid gap-3">
            {conversations.map((conv) => {
              const otherId = conv.participant_a === user?.id ? conv.participant_b : conv.participant_a
              const other = profileMap[otherId] || null
              return (
                <Link
                  key={conv.id}
                  href={`/chat?with=${otherId}`}
                  className="card p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <Avatar src={other?.avatar_url} name={other?.full_name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{other?.full_name || 'User'}</p>
                    {conv.last_message_at && (
                      <p className="text-xs text-slate-500">
                        {new Date(conv.last_message_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <span className="text-indigo-600 text-sm">Chat →</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Notifications</h2>
        {(offers as OfferRecord[])?.length ? (offers as OfferRecord[]).map((offer: OfferRecord) => (
          <div key={offer.id} className="card p-6">
            <h3 className="text-lg font-semibold">{offer.projects?.[0]?.title}</h3>
            <p className="text-slate-600 mb-4">{offer.projects?.[0]?.description}</p>
            <p className="text-sm mb-4">Status: <span className="font-medium">{offer.status}</span></p>
            {offer.status === 'pending' && (
              <div className="flex gap-3">
                <form action={respondToOffer}>
                  <input type="hidden" name="offer_id" value={offer.id} />
                  <input type="hidden" name="decision" value="accepted" />
                  <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Accept</button>
                </form>
                <form action={respondToOffer}>
                  <input type="hidden" name="offer_id" value={offer.id} />
                  <input type="hidden" name="decision" value="declined" />
                  <button className="px-4 py-2 rounded-xl border">Decline</button>
                </form>
              </div>
            )}
          </div>
        )) : <div className="card p-8 text-slate-600">No notifications yet. You are all caught up.</div>}
      </section>
    </div>
  )
}
