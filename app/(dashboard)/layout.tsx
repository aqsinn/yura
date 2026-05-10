import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LayoutGrid, SquarePlus, Bell, User, Compass, Rocket } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const navItems = [
    { name: 'Feed', href: '/feed', icon: LayoutGrid },
    { name: 'Create', href: '/projects/create', icon: SquarePlus },
    { name: 'Discover', href: '/discover', icon: Compass },
    { name: 'Signals', href: '/notifications', icon: Bell },
    { name: 'Profile', href: '/profile', icon: User },
  ]

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-72 border-r hidden lg:flex flex-col p-8 fixed h-full bg-white">
        <div className="flex items-center gap-3 mb-12 font-bold text-2xl text-indigo-600">
          <Rocket className="text-indigo-600" /> Yura
        </div>
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-600 hover:text-indigo-700 hover:bg-indigo-50 transition-all">
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="lg:ml-72 flex-1 p-6 lg:p-10 pb-24 lg:pb-10">
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 lg:hidden border-t bg-white p-3">
        <div className="grid grid-cols-5 gap-2">
          {navItems.map((item) => (
            <Link key={item.name} href={item.href} className="flex flex-col items-center gap-1 py-2 text-xs text-slate-600">
              <item.icon size={18} />
              {item.name}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
