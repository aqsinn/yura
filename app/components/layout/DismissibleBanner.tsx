'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function DismissibleBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="sticky top-0 z-[60] w-full border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
      <div className="relative max-w-7xl mx-auto">
        {/* pr-14 ensures the text/button never goes under the X on mobile.
          Items-center keeps everything vertically aligned.
        */}
        <Link 
          href="/pricing" 
          className="block py-3 pl-4 pr-14 sm:pl-6 sm:pr-16 group transition-all"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[13px] sm:text-sm font-bold truncate">
               Be AlphaMaxed, Save 20% Every.Single.Year.
              </div>
              <div className="text-[11px] sm:text-xs text-indigo-100 truncate">
                Featured badge, better matching, and boosts. Click for more.
              </div>
            </div>
            
            {/* View Plans Button - Hidden on small mobile to prevent crowding */}
            <span className="hidden md:inline-flex shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-600 transition-transform group-hover:scale-105">
              View plans
            </span>
          </div>
        </Link>

        {/* Large X Button: 
          Positioned absolutely so it stays pinned to the right.
          p-3 and w-6 h-6 makes the hit area and icon bigger.
        */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsVisible(false);
          }}
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Dismiss banner"
        >
          <X className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}