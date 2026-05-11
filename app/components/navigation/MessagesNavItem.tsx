'use client'

import { useEffect, useState, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const emptySubscribe = () => () => {}
const getSnapshot = () => true

export default function MessagesNavItem() {
  const [unreadCount, setUnreadCount] = useState(0)
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const supabase = createClient()

    const fetchUnread = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data: conversations } = await supabase
        .from('conversations')
        .select('id')
        .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)

      const convIds = (conversations || []).map((c: Record<string, string>) => c.id)
      if (convIds.length === 0) {
        setUnreadCount(0)
        return
      }

      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .in('conversation_id', convIds)
        .neq('sender_id', user.id)
        .is('read_at', null)

      setUnreadCount(count ?? 0)
    }

    fetchUnread()

    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        async (payload) => {
          const {
            data: { user },
          } = await supabase.auth.getUser()
          if (!user) return
          const msg = payload.new as Record<string, string>
          if (msg.sender_id === user.id) return

          setUnreadCount((c) => c + 1)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <Link
      href="/messages"
      className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
    >
      <div className="relative">
        <MessageCircle size={20} />
        {isMounted && unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
      <span className="text-sm font-medium">Messages</span>
    </Link>
  )
}
