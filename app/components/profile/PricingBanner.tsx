'use client'

import React, { useState } from 'react'
import { Check, Star, Rocket, Loader2 } from 'lucide-react'
import { cn } from '@/utils/cn'

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
    buttonText: 'Get started',
    mostPopular: false,
    color: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    badge: 'EcoUser',
  },
  {
    name: 'SigmaPlus',
    id: 'tier-sigma',
    price: { monthly: '$5', yearly: '$48' },
    priceIds: { 
      monthly: process.env.NEXT_PUBLIC_STRIPE_SIGMA_MONTHLY_ID || 'price_sigma_monthly', 
      yearly: process.env.NEXT_PUBLIC_STRIPE_SIGMA_YEARLY_ID || 'price_sigma_yearly' 
    },
    description: 'For active collaborators',
    features: [
      '15 active projects',
      'Unlimited requests',
      'Priority in smart matching',
      'Skill analytics ✅',
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
      monthly: process.env.NEXT_PUBLIC_STRIPE_ALPHA_MONTHLY_ID || 'price_alpha_monthly', 
      yearly: process.env.NEXT_PUBLIC_STRIPE_ALPHA_YEARLY_ID || 'price_alpha_yearly' 
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
    buttonText: 'Go Pro',
    mostPopular: true,
    color: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20',
    badge: 'Premium',
  },
]

export default function PricingBanner() {
  const [isAnnual, setIsAnnual] = useState(false)
  const [loadingTier, setLoadingTier] = useState<string | null>(null)

  const handleCheckout = async (tier: typeof tiers[0]) => {
    if (tier.id === 'tier-eco') return

    setLoadingTier(tier.id)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: isAnnual ? tier.priceIds.yearly : tier.priceIds.monthly,
          isAnnual,
        }),
      })

      const data = await response.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Error initiating checkout:', error)
    } finally {
      setLoadingTier(null)
    }
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          Yura pricing
        </h2>
        <p className="mt-4 text-xl text-gray-400">
          Simple plans that grow with your ambition. Save 20% on any paid plan with annual billing.
        </p>

        <div className="mt-8 flex justify-center items-center space-x-4">
          <span className={cn("text-sm", !isAnnual ? "text-white" : "text-gray-500")}>Monthly</span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-gray-700"
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                isAnnual ? "translate-x-5" : "translate-x-0"
              )}
            />
          </button>
          <span className={cn("text-sm", isAnnual ? "text-white" : "text-gray-500")}>
            Annual <span className="text-emerald-500 font-medium">20% savings</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={cn(
              "relative flex flex-col p-8 rounded-3xl border transition-all duration-300 hover:scale-[1.02]",
              tier.mostPopular 
                ? "bg-gray-900/60 border-indigo-500/50 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]" 
                : "bg-gray-900/40 border-gray-800"
            )}
          >
            {tier.mostPopular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-indigo-500 rounded-full text-xs font-bold text-white flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Most popular
              </div>
            )}

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <p className="text-sm text-gray-400">{tier.description}</p>
              </div>
              <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border", tier.color)}>
                {tier.badge}
              </span>
            </div>

            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">
                {isAnnual ? tier.price.yearly : tier.price.monthly}
              </span>
              <span className="text-gray-400 text-lg">
                {isAnnual ? '/year' : '/mo'}
              </span>
              {isAnnual && tier.id !== 'tier-eco' && (
                <p className="text-emerald-500 text-xs mt-1 font-medium">
                  Save ${parseInt(tier.price.monthly.replace('$', '')) * 12 - parseInt(tier.price.yearly.replace('$', ''))}
                </p>
              )}
            </div>

            <ul className="flex-1 space-y-4 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleCheckout(tier)}
              disabled={loadingTier !== null || tier.id === 'tier-eco'}
              className={cn(
                "w-full py-3 px-6 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2",
                tier.mostPopular
                  ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
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

      <div className="mt-12 p-6 rounded-2xl bg-gray-900/40 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-left">
          <div className="p-3 bg-indigo-500/10 rounded-xl">
            <Rocket className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-bold text-white">Project boost – available on all paid plans</h4>
            <p className="text-sm text-gray-400">Pay $2–$10 to pin your project to the top of the feed for 7 days. Drives 3–5x more applicants.</p>
          </div>
        </div>
        <div className="flex -space-x-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 overflow-hidden">
              <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
