'use client'
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const hasSupabaseEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  const handleAuth = async (type: 'LOGIN' | 'SIGNUP') => {
    setError(null)
    if (!hasSupabaseEnv) {
      setError('Supabase environment variables are missing.')
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = type === 'LOGIN' 
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
    } else {
      router.push('/feed')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <input 
        type="email" placeholder="Email address" 
        className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input 
        type="password" placeholder="Password" 
        className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button 
        onClick={() => handleAuth('LOGIN')}
        className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl mt-2 hover:bg-indigo-700 transition-all"
        disabled={loading || !hasSupabaseEnv}
      >
        {!hasSupabaseEnv ? 'Configure Supabase first' : loading ? 'Signing in...' : 'Sign in'}
      </button>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <p className="text-sm text-slate-600 text-center">
        Don&apos;t have an account? <Link href="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
      </p>
    </div>
  )
}