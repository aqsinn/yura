import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/feed')
  }

  return (
    <>
      <Link
        href="/pricing"
        className="block border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
      >
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-sm font-semibold truncate">
              Premium plans are live: Starter ($5/mo) + Pro ($7/mo)
            </div>
            <div className="text-xs text-indigo-100 truncate">
              View pricing before you sign in.
            </div>
          </div>
          <span className="shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-600">
            View plans
          </span>
        </div>
      </Link>
      {children}
    </>
  )
}
