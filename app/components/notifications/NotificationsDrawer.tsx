'use client'

import { ReactNode } from 'react'

export default function NotificationsDrawer({ children }: { children: ReactNode }) {
  return (
    <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l shadow-xl p-5 overflow-y-auto">
      {children}
    </aside>
  )
}
