'use client'

import Link from 'next/link'
import { MessageCircle } from 'lucide-react'

export default function MessagesWidget() {
  return (
    <div className="fixed top-24 right-6 z-40">
      <Link
        href="/messages"
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border shadow-lg text-sm font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all"
      >
        <MessageCircle size={18} />
        <span>Messages</span>
      </Link>
    </div>
  )
}
