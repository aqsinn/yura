import Link from 'next/link'
import SignupForm from '@/app/components/auth/SignupForm'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
      <div className="card w-full max-w-md p-8">
        <h1 className="text-3xl font-semibold mb-2">Create your account</h1>
        <p className="text-slate-600 mb-6">Join students building impactful projects worldwide.</p>
        {error ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 text-red-700 p-3 text-sm break-words">
            {error}
          </div>
        ) : null}
        <SignupForm />
        <p className="text-sm text-slate-500 mt-6">
          Already have an account? <Link href="/login" className="text-indigo-600 hover:underline">Sign in</Link>
        </p>
      </div>
    </main>
  )
}
