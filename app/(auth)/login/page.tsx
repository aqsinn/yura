import Link from 'next/link'
import LoginForm from '@/app/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-slate-600 mb-6">Sign in to continue building on Yura.</p>
        <LoginForm />
        <p className="text-sm text-slate-500 mt-6">
          Need an account? <Link href="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  )
}
