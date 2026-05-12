//app/components/layout/DismissibleBanner.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function DismissibleBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="sticky top-0 z-[60] w-full border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Main Content Link */}
        <Link href="/pricing" className="flex-1 min-w-0 group mr-8">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[13px] sm:text-sm font-semibold truncate">
                Premium plans are live: Starter ($5/mo) + Pro ($7/mo)
              </div>
              <div className="text-[11px] sm:text-xs text-indigo-100 truncate">
                Featured badge, better matching, and more. Tap to view.
              </div>
            </div>
            {/* Hidden on small mobile to save space */}
            <span className="shrink-0 rounded-xl bg-white px-3 py-1.5 text-xs sm:text-sm font-bold text-indigo-600 transition-transform group-hover:scale-105 hidden md:block">
              View plans
            </span>
          </div>
        </Link>

        {/* The X Button */}
        <button
          onClick={() => setIsVisible(false)}
          className="absolute right-2 sm:right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  )
}