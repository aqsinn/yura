import Link from 'next/link'
import LoginForm from '@/app/components/auth/LoginForm'

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="grid min-h-[80vh] grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center p-8 lg:p-16">
          <div className="card w-full max-w-md p-8">
            <h1 className="text-4xl font-bold text-indigo-600 mb-2">Yura</h1>
            <p className="text-slate-600 mb-8">Find teammates. Build global student projects.</p>
            <LoginForm />
            <p className="text-sm text-slate-500 mt-6">
              New here? <Link href="/signup" className="text-indigo-600 hover:underline">Create an account</Link>
            </p>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center p-8 bg-gradient-to-br from-indigo-50 to-white">
          <div className="card w-full max-w-2xl p-10">
            <h2 className="text-2xl font-semibold mb-3">How Yura feels</h2>
            <p className="text-slate-600 mb-6">Create a project, match by skills, and invite collaborators in minutes.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border bg-surface-muted p-4">Post project with required skills</div>
              <div className="rounded-xl border bg-surface-muted p-4">Smart offers sent to matching students</div>
              <div className="rounded-xl border bg-surface-muted p-4">Discover opportunities by category</div>
              <div className="rounded-xl border bg-surface-muted p-4">Track offers in notifications panel</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-8 lg:px-16">
        <h2 className="text-3xl font-semibold text-center mb-10">How it works</h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-5xl mx-auto">
          <div className="card p-6">Build your profile with skills and portfolio links.</div>
          <div className="card p-6">Create projects and define required skills and timeline.</div>
          <div className="card p-6">Receive and send collaboration offers instantly.</div>
        </div>
      </section>

      <section className="py-20 px-8 lg:px-16 bg-white">
        <div className="max-w-5xl mx-auto grid gap-4 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="text-xl font-semibold mb-2">Values</h3>
            <p className="text-slate-600">Global collaboration, skill-first discovery, and fair opportunity for every student.</p>
          </div>
          <div className="card p-8">
            <h3 className="text-xl font-semibold mb-2">Premium</h3>
            <p className="text-slate-600">Advanced ranking, unlimited outreach, and priority profile visibility.</p>
          </div>
        </div>
      </section>

      <section className="py-14 px-8 lg:px-16 border-t bg-slate-50">
        <div className="max-w-5xl mx-auto flex flex-col gap-2 md:flex-row md:justify-between text-slate-600">
          <span>Contact: hello@yura.app</span>
          <span>Yura - Build together worldwide</span>
        </div>
      </section>
    </main>
  )
}