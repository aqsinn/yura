'use client'

import Link from 'next/link'
import { LayoutGrid, SquarePlus, User } from 'lucide-react'
import MyProjectsNavItem from '@/app/components/navigation/MyProjectsNavItem'
import MessagesNavItem from '@/app/components/navigation/MessagesNavItem'
import SignalsNavItem from '@/app/components/navigation/SignalsNavItem'

const staticNavItems = [
  { name: 'Feed', href: '/feed', icon: LayoutGrid },
  { name: 'Create', href: '/projects/create', icon: SquarePlus },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function DashboardNav() {
  return (
    <nav className="flex-1 space-y-3">
      {staticNavItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all"
        >
          <item.icon size={20} />
          <span className="text-sm font-medium">{item.name}</span>
        </Link>
      ))}
      <SignalsNavItem />
      <MyProjectsNavItem />
      <MessagesNavItem />
    </nav>
  )
}
