'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Avatar from '@/app/components/common/Avatar'
import { Send } from 'lucide-react'

type Message = {
  id: string
  content: string
  sender_id: string
  created_at: string
}

export default function ChatUI({
  conversationId,
  otherUser,
  currentUserId,
  initialMessages,
}: {
  conversationId: string | null
  otherUser: { id: string; full_name: string | null; avatar_url: string | null }
  currentUserId: string
  currentUserName?: string | null
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [convId, setConvId] = useState(conversationId)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!convId) return

    const channel = supabase
      .channel(`chat:${convId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${convId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message
          setMessages((prev) => [...prev, newMsg])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [convId, supabase])

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return
    setSending(true)

    try {
      let targetConvId = convId

      if (!targetConvId) {
        const { data: existing } = await supabase
          .from('conversations')
          .select('id')
          .or(
            `and(participant_a.eq.${currentUserId},participant_b.eq.${otherUser.id}),and(participant_a.eq.${otherUser.id},participant_b.eq.${currentUserId})`
          )
          .single()

        if (existing) {
          targetConvId = existing.id
        } else {
          const { data: newConv } = await supabase
            .from('conversations')
            .insert({
              participant_a: currentUserId,
              participant_b: otherUser.id,
            })
            .select('id')
            .single()
          targetConvId = newConv?.id ?? null
        }
        if (targetConvId) setConvId(targetConvId)
      }

      if (!targetConvId) return

      const { data: sent } = await supabase
        .from('messages')
        .insert({
          conversation_id: targetConvId,
          sender_id: currentUserId,
          content: newMessage.trim(),
        })
        .select('id, content, sender_id, created_at')
        .single()

      if (sent) {
        await supabase
          .from('conversations')
          .update({ last_message_at: new Date().toISOString() })
          .eq('id', targetConvId)
      }

      setNewMessage('')
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <a
          href="/notifications"
          className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
        >
          ← Back to signals
        </a>
      </div>

      <div className="card p-4 flex items-center gap-3">
        <Avatar src={otherUser.avatar_url} name={otherUser.full_name} size="md" />
        <div>
          <h2 className="font-semibold">{otherUser.full_name || 'User'}</h2>
          <p className="text-xs text-slate-500">Tap to message</p>
        </div>
      </div>

      <div className="card p-4 space-y-3 h-[400px] overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-20">
            Say hi to {otherUser.full_name?.split(' ')[0] || 'them'}!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId
            return (
              <div
                key={msg.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-md'
                      : 'bg-slate-100 text-slate-900 rounded-bl-md'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="card p-3 flex gap-2 items-end">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="flex-1 border rounded-xl p-3 text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={sendMessage}
          disabled={sending || !newMessage.trim()}
          className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-all"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}
