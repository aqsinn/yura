///components/profile/PricingBanner.tsx
'use client'

import { useMemo, useState } from 'react'
import { Check, Star, Rocket, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

type CheckoutTarget =
  | { kind: 'price'; priceId: string }
  | { kind: 'product'; productId: string }
  | { kind: 'none' }

const tiers = [
  {
    name: 'EcoUser',
    id: 'tier-eco',
    price: { monthly: '$0', yearly: '$0' },
    priceIds: { monthly: '', yearly: '' },
    description: 'Just getting started',
    features: [
      'Browse all open projects',
      '5 active projects',
      'Basic profile + skills',
      'Receive match offers',
      'Smart matching',
      'Portfolio export',
    ],
    buttonText: 'Free to use!',
    mostPopular: false,
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    badge: 'EcoUser',
  },
  {
    name: 'SigmaPlus',
    id: 'tier-sigma',
    price: { monthly: '$5', yearly: '$48' },
    priceIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_SIGMA_MONTHLY_ID || '',
      yearly: process.env.NEXT_PUBLIC_STRIPE_SIGMA_YEARLY_ID || '',
    },
    description: 'For active collaborators',
    features: [
      '15 active projects',
      'Unlimited requests',
      'Priority in smart matching',
      'Skill analytics ',
      'Project boost (1/mo)',
      'Featured profile badge',
    ],
    buttonText: 'Start building',
    mostPopular: false,
    color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    badge: 'SigmaPlus',
  },
  {
    name: 'AlphaMaxed',
    id: 'tier-alpha',
    price: { monthly: '$7', yearly: '$67' },
    priceIds: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_ALPHA_MONTHLY_ID || '',
      yearly: process.env.NEXT_PUBLIC_STRIPE_ALPHA_YEARLY_ID || '',
    },
    description: 'For serious team leads',
    features: [
      'Unlimited projects',
      'Featured profile badge',
      'AI-powered smart match',
      'Team analytics dashboard',
      'Priority support',
      'Early access to features',
    ],
    buttonText: 'Get AlphaMaxed',
    mostPopular: true,
    color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    badge: 'Premium',
  },
]

export default function PricingBanner() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [loadingTier, setLoadingTier] = useState<string | null>(null)
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const pricing = useMemo(() => {
    const missingCheckoutKeys: string[] = []
    if (!process.env.NEXT_PUBLIC_STRIPE_SIGMA_MONTHLY_ID) missingCheckoutKeys.push('NEXT_PUBLIC_STRIPE_SIGMA_MONTHLY_ID')
    if (!process.env.NEXT_PUBLIC_STRIPE_ALPHA_MONTHLY_ID) missingCheckoutKeys.push('NEXT_PUBLIC_STRIPE_ALPHA_MONTHLY_ID')

    const saveByTierId = new Map<string, number>()
    for (const tier of tiers) {
      if (tier.id === 'tier-eco') continue
      const monthly = Number(tier.price.monthly.replace('$', ''))
      const yearly = Number(tier.price.yearly.replace('$', ''))
      saveByTierId.set(tier.id, monthly * 12 - yearly)
    }
    return { saveByTierId, missingCheckoutKeys }
  }, [])

  const getCheckoutTarget = (tier: typeof tiers[0], annual: boolean): CheckoutTarget => {
    const value = annual ? tier.priceIds.yearly : tier.priceIds.monthly
    const fallback = tier.priceIds.monthly
    const effectiveValue = value || fallback

    if (!effectiveValue) return { kind: 'none' }
    if (effectiveValue.startsWith('price_')) return { kind: 'price', priceId: effectiveValue }
    if (effectiveValue.startsWith('prod_')) return { kind: 'product', productId: effectiveValue }
    return { kind: 'none' }
  }

  const handleCheckout = async (tier: typeof tiers[0]) => {
    if (tier.id === 'tier-eco') return
    setCheckoutError(null)
    const target = getCheckoutTarget(tier, isAnnual)
    if (target.kind === 'none') return

    setLoadingTier(tier.id)
    try {
      const interval = isAnnual ? 'year' : 'month'
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
body: JSON.stringify({
  interval,
  tier: tier.id === 'tier-sigma' ? 'sigma' : 'alpha',
  ...(target.kind === 'price' ? { priceId: target.priceId } : {}),
  ...(target.kind === 'product' ? { productId: target.productId } : {}),
}),
              })

      const data = await response.json().catch(() => null)
      if (response.status === 401) {
        window.location.href = '/login'
        return
      }
      if (!response.ok) {
        setCheckoutError(typeof data?.message === 'string' ? data.message : null)
        return
      }
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error initiating checkout:', error)
      setCheckoutError('Checkout failed. Try again.')
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border bg-white shadow-[0_10px_40px_rgba(79,70,229,0.12)]">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-white" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-indigo-100/70 blur-3xl" />

        <div className="relative p-8 sm:p-10">
          {pricing.missingCheckoutKeys.length ? (
            <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-amber-900">
              <div className="font-semibold">Payments are not configured yet</div>
              <div className="text-sm text-amber-800">
                Set your Stripe IDs (price_... or prod_...) in Vercel, then redeploy:
              </div>
              <div className="mt-2 text-xs font-mono text-amber-900 break-words">
                {pricing.missingCheckoutKeys.join(' · ')}
              </div>
            </div>
          ) : null}

          {checkoutError ? (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-800">
              {checkoutError}
            </div>
          ) : null}

          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Yura pricing
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Simple plans that grow with your ambition. Save 20% on any paid plan with annual billing.
            </p>

            <div className="mt-6 flex justify-center items-center gap-4">
              <span className={cn("text-sm font-medium", !isAnnual ? "text-slate-900" : "text-slate-500")}>Monthly</span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className={cn(
                  "relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border transition-colors duration-200 ease-in-out focus:outline-none",
                  isAnnual ? "bg-indigo-600 border-indigo-600" : "bg-slate-200 border-slate-300"
                )}
                aria-label="Toggle billing period"
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                    isAnnual ? "translate-x-5" : "translate-x-0"
                  )}
                />
              </button>
              <span className={cn("text-sm font-medium", isAnnual ? "text-slate-900" : "text-slate-500")}>
                Annual <span className="text-emerald-600 font-semibold">20% savings</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={cn(
                  "relative flex flex-col p-7 rounded-3xl border bg-white transition-all duration-200 hover:shadow-lg",
                  tier.mostPopular
                    ? "border-indigo-300 shadow-[0_12px_40px_rgba(79,70,229,0.16)]"
                    : "border-slate-200 shadow-sm"
                )}
              >
                {tier.mostPopular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-600 rounded-full text-xs font-bold text-white flex items-center gap-1 shadow">
                    <Star className="w-3 h-3 fill-white" />
                    Most popular
                  </div>
                )}

                <div className="flex justify-between items-start mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{tier.name}</h3>
                    <p className="text-sm text-slate-600">{tier.description}</p>
                  </div>
                  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", tier.color)}>
                    {tier.badge}
                  </span>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">
                    {isAnnual ? tier.price.yearly : tier.price.monthly}
                  </span>
                  <span className="text-slate-500 text-lg">
                    {isAnnual ? '/year' : '/mo'}
                  </span>
                  {isAnnual && tier.id !== 'tier-eco' ? (
                    <p className="text-emerald-600 text-xs mt-1 font-semibold">
                      Save ${pricing.saveByTierId.get(tier.id) ?? 0}
                    </p>
                  ) : null}
                </div>

                <ul className="flex-1 space-y-3 mb-7">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => handleCheckout(tier)}
                  disabled={
                    loadingTier !== null ||
                    tier.id === 'tier-eco' ||
                    getCheckoutTarget(tier, isAnnual).kind === 'none'
                  }
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2",
                    tier.mostPopular
                      ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
                      : "bg-slate-900 hover:bg-slate-800 text-white",
                    (loadingTier !== null || tier.id === 'tier-eco') && "opacity-50 cursor-not-allowed"
                  )}
                >
                  {loadingTier === tier.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    tier.buttonText
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-indigo-50 border border-indigo-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-indigo-600/10 rounded-xl">
                <Rocket className="w-6 h-6 text-indigo-700" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Project boost – available on all paid plans</h4>
                <p className="text-sm text-slate-600">Pay $2–$10 to pin your project to the top of the feed for 7 days. Drives 3–5x more applicants.</p>
              </div>
            </div>
            <div className="flex -space-x-2">
              {["bg-indigo-200", "bg-indigo-300", "bg-indigo-400", "bg-indigo-500"].map((bg) => (
                <div key={bg} className={cn("w-9 h-9 rounded-full border-2 border-white shadow-sm", bg)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
