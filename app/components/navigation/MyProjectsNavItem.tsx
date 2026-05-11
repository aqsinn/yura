'use client'

import { useEffect, useState, useRef, useSyncExternalStore } from 'react'
import Link from 'next/link'
import { FolderKanban } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'

const emptySubscribe = () => () => {}
const getSnapshot = () => true

export default function MyProjectsNavItem() {
  const [pendingCount, setPendingCount] = useState(0)
  const isMounted = useSyncExternalStore(emptySubscribe, getSnapshot)
  const hasFetched = useRef(false)

  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('offers')
        .select('id', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .then(({ count }) => {
          setPendingCount(count ?? 0)
        })
    })
  }, [])

  return (
    <Link
      href="/my-projects"
      className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
    >
      <div className="relative">
        <FolderKanban size={20} />
        {isMounted && pendingCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm animate-pulse">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </div>
      <span className="text-sm font-medium">My Projects</span>
    </Link>
  )
}
