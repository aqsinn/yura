import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ChatUI from './ChatUI'

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ with?: string }>
}) {
  const { with: otherUserId } = await searchParams
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  if (!otherUserId) redirect('/messages')

  const { data: otherProfile } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url')
    .eq('id', otherUserId)
    .single()

  if (!otherProfile) redirect('/messages')

  const { data: conversation } = await supabase
    .from('conversations')
    .select('id')
    .or(`and(participant_a.eq.${user.id},participant_b.eq.${otherUserId}),and(participant_a.eq.${otherUserId},participant_b.eq.${user.id})`)
    .single()

  const conversationId = conversation?.id ?? null

  const { data: messages } = conversationId
    ? await supabase
        .from('messages')
        .select('id, content, sender_id, created_at')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
    : { data: [] }

  // Mark incoming messages as read now that the user has opened the conversation
  if (conversationId) {
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .neq('sender_id', user.id)
      .is('read_at', null)
  }

  return (
    <ChatUI
      conversationId={conversationId}
      otherUser={otherProfile}
      currentUserId={user.id}
      initialMessages={(messages as { id: string; content: string; sender_id: string; created_at: string }[]) ?? []}
    />
  )
}
