'use client'

import { useState } from 'react'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
  xl: 'w-20 h-20 text-xl',
}

function getInitials(name: string | null | undefined): string {
  if (!name) return '?'
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function getColorFromName(name: string | null | undefined): string {
  if (!name) return '#6366f1'
  const colors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
    '#f59e0b', '#10b981', '#14b8a6', '#06b6d4', '#3b82f6',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export default function Avatar({
  src,
  name,
  size = 'md',
  className = '',
}: {
  src?: string | null
  name?: string | null
  size?: AvatarSize
  className?: string
}) {
  const [imgError, setImgError] = useState(false)
  const initials = getInitials(name)
  const bgColor = getColorFromName(name)

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        onError={() => setImgError(true)}
        className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0 ${className}`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initials}
    </div>
  )
}
