import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Rocket } from 'lucide-react'
import { createClient } from '@/utils/supabase/server'
import DashboardNav from '@/app/components/navigation/DashboardNav'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-72 border-r hidden lg:flex flex-col p-8 fixed h-full bg-white">
        <div className="flex items-center gap-3 mb-12 font-bold text-2xl text-indigo-600">
          <Rocket className="text-indigo-600" /> Yura
        </div>
        <DashboardNav />
      </aside>

      <main className="lg:ml-72 flex-1 p-6 lg:p-10 pb-24 lg:pb-10">
        <div className="-mx-6 lg:-mx-10 -mt-6 lg:-mt-10 mb-6 lg:mb-8 sticky top-0 z-30">
          <Link
            href="/pricing"
            className="group block border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
          >
            <div className="max-w-5xl mx-auto px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  Premium plans are live: Starter ($5/mo) + Pro ($7/mo)
                </div>
                <div className="text-xs text-indigo-100 truncate">
                  Featured badge, better matching, boosts, and more. Tap to view pricing.
                </div>
              </div>
              <span className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-600 transition-transform group-hover:scale-105">
                View plans
              </span>
            </div>
          </Link>
        </div>
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 lg:hidden border-t bg-white p-3">
        <div className="grid grid-cols-7 gap-2">
          <Link href="/feed" className="flex flex-col items-center gap-1 py-2 text-xs text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
            Feed
          </Link>
          <Link href="/projects/create" className="flex flex-col items-center gap-1 py-2 text-xs text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            Create
          </Link>
          <Link href="/my-projects" className="flex flex-col items-center gap-1 py-2 text-xs text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/></svg>
            My
          </Link>
          <Link href="/notifications" className="flex flex-col items-center gap-1 py-2 text-xs text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            Signal
          </Link>
          <Link href="/messages" className="flex flex-col items-center gap-1 py-2 text-xs text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Msg
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 py-2 text-xs text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
            Profile
          </Link>
        </div>
      </nav>
    </div>
  )
}
