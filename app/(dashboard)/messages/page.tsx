import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Avatar from '@/app/components/common/Avatar'
import Link from 'next/link'

type ConversationRecord = {
  id: string
  participant_a: string
  participant_b: string
  last_message_at: string | null
}

export default async function MessagesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: conversationsRaw } = await supabase
    .from('conversations')
    .select('id, participant_a, participant_b, last_message_at')
    .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  const conversations = (conversationsRaw || []) as ConversationRecord[]

  const otherUserIds = conversations.map((c) =>
    c.participant_a === user.id ? c.participant_b : c.participant_a
  )

  const { data: otherProfiles } = otherUserIds.length
    ? await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .in('id', otherUserIds)
    : { data: [] }

  const profileMap: Record<string, { full_name: string | null; avatar_url: string | null }> = {}
  for (const p of otherProfiles || []) {
    profileMap[p.id] = p
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">Messages</h1>

      {conversations.length === 0 ? (
        <div className="card p-8 text-center text-slate-500">
          No conversations yet. Start chatting from a project page or profile!
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conv) => {
            const otherId =
              conv.participant_a === user.id
                ? conv.participant_b
                : conv.participant_a
            const other = profileMap[otherId]
            return (
              <Link
                key={conv.id}
                href={`/chat?with=${otherId}`}
                className="card p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors"
              >
                <Avatar
                  src={other?.avatar_url}
                  name={other?.full_name}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {other?.full_name || 'User'}
                  </p>
                  {conv.last_message_at && (
                    <p className="text-xs text-slate-500">
                      {new Date(
                        conv.last_message_at
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <span className="text-indigo-600 text-sm">Chat →</span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
