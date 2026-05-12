'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export default function DismissibleBanner() {
  const [isVisible, setIsVisible] = useState(true)

  // Optional: Check local storage so it stays hidden on refresh
  useEffect(() => {
    const isHidden = localStorage.getItem('hide-pricing-banner')
    if (isHidden === 'true') {
      setIsVisible(false)
    }
  }, [])

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault() // Prevents the Link from triggering
    e.stopPropagation()
    setIsVisible(false)
    localStorage.setItem('hide-pricing-banner', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="sticky top-0 z-[60] w-full border-b bg-gradient-to-r from-indigo-600 to-indigo-500 text-white">
      <div className="relative max-w-7xl mx-auto">
        <Link 
          href="/pricing" 
          className="block px-4 py-3 sm:px-6 pr-12 group transition-all"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-[13px] sm:text-sm font-bold truncate">
                Premium plans are live: Starter ($5/mo) + Pro ($7/mo)
              </div>
              <div className="text-[11px] sm:text-xs text-indigo-100 truncate">
                Featured badge, better matching, and boosts. Tap to view.
              </div>
            </div>
            
            {/* Badge: Visible on tablet/desktop, hidden on tiny phones */}
            <span className="hidden md:inline-flex shrink-0 rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-600 transition-transform group-hover:scale-105">
              View plans
            </span>
          </div>
        </Link>

        {/* Dismiss Button - Positioned absolutely to stay on the right */}
        <button
          onClick={handleClose}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-white/20 rounded-full transition-colors z-10"
          aria-label="Dismiss banner"
        >
          <X className="w-5 h-5 text-white/90" />
        </button>
      </div>
    </div>
  )
}