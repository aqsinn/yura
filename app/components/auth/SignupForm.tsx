'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const handleSignup = async () => {
    if (!hasSupabaseEnv) {
      alert('Supabase environment variables are missing.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password })
    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    router.push('/feed')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <input
        type="email"
        placeholder="Email address"
        className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleSignup}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl mt-2 hover:bg-indigo-700 transition-all"
        disabled={loading || !hasSupabaseEnv}
      >
        {!hasSupabaseEnv ? 'Configure Supabase first' : loading ? 'Creating account...' : 'Create account'}
      </button>
      <p className="text-sm text-slate-600 text-center">
        Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Sign in</Link>
      </p>
    </div>
  )
}
