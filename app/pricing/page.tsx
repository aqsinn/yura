import Link from 'next/link'
import PricingBanner from '@/app/components/profile/PricingBanner'

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-5xl mx-auto px-6 pt-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Pricing</h1>
            <p className="text-slate-600">Choose a plan that fits your ambition.</p>
          </div>
          <Link href="/feed" className="px-4 py-2 rounded-xl border text-sm hover:bg-white">
            Back
          </Link>
        </div>
      </div>

      <PricingBanner />

      <div className="max-w-5xl mx-auto px-6 pb-14">
        <div className="text-sm text-slate-600">
          To subscribe, sign in and complete checkout.
        </div>
      </div>
    </main>
  )
}

