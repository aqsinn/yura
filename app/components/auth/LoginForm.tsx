import Link from 'next/link'
import { signInWithPassword } from '@/app/(auth)/actions'

export default function LoginForm() {
  return (
    <div className="space-y-4">
      <form action={signInWithPassword} className="space-y-4">
        <input
          name="email"
          type="email"
          placeholder="Email address"
          className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
          required
        />
        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl mt-2 hover:bg-indigo-700 transition-all"
        >
          Sign in
        </button>
      </form>
      <p className="text-sm text-slate-600 text-center">
        Don&apos;t have an account? <Link href="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
      </p>
    </div>
  )
}