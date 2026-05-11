import Link from 'next/link'
import LoginForm from '@/app/components/auth/LoginForm'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; info?: string }>
}) {
  const { error, info } = await searchParams
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-semibold mb-2">Welcome back</h1>
        <p className="text-slate-600 mb-6">Sign in to continue building on Yura.</p>
        {info === 'check-email' ? (
          <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 text-indigo-700 p-3 text-sm">
            Check your email to confirm your account, then sign in.
          </div>
        ) : null}
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm break-words">
            {error}
          </div>
        ) : null}
        <LoginForm />
        <p className="text-sm text-slate-500 mt-6">
          Need an account? <Link href="/signup" className="text-indigo-600 hover:underline">Sign up</Link>
        </p>
      </div>
    </main>
  )
}
