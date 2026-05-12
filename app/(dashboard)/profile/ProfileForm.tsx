// app/(dashboard)/profile/ProfileForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TagInput from '@/app/components/common/TagInput'
import AvatarUploadField from '@/app/components/common/AvatarUploadField'
import { updateProfile } from './actions'
import { Pencil, School, Check, X, ShieldCheck, Crown, Flame, Loader2 } from 'lucide-react'

type UserTier = 'free' | 'starter' | 'pro' | 'premium' | 'sigma' | 'alpha'

type DefaultValues = {
  full_name?: string | null
  bio?: string | null
  university?: string | null
  skills?: string[]
  avatar_url?: string | null
  tier?: UserTier | string
}

export default function ProfileForm({
  defaultValues,
  userId,
}: {
  defaultValues: DefaultValues
  userId: string
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [liveValues, setLiveValues] = useState<DefaultValues>(defaultValues)
  const [activating, setActivating] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('success') !== 'true') return

    setActivating(true)

    const confirm = async () => {
      try {
        const res = await fetch('/api/confirm-payment', { method: 'POST' })
        const data = await res.json()

        if (data.tier && data.tier !== 'free') {
          setLiveValues(prev => ({ ...prev, tier: data.tier }))
          setActivating(false)
          router.replace('/profile', { scroll: false })
          return
        }

        // Stripe sub not ready yet — retry once after 3s
        setTimeout(async () => {
          try {
            const res2 = await fetch('/api/confirm-payment', { method: 'POST' })
            const data2 = await res2.json()
            if (data2.tier) setLiveValues(prev => ({ ...prev, tier: data2.tier }))
          } catch {}
          setActivating(false)
          router.replace('/profile', { scroll: false })
        }, 3000)
      } catch {
        setActivating(false)
        router.refresh()
      }
    }

    confirm()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { setLiveValues(defaultValues) }, [defaultValues])

  const values = liveValues
  const currentTier = (values.tier?.toLowerCase() || 'free') as UserTier
  const isPaid = currentTier !== 'free'

  const tierStyles: Record<UserTier, { container: string; badge: string; accent: string; button: string; input: string; icon: any }> = {
    free:    { container: 'bg-white border-slate-200', badge: 'bg-slate-100 text-slate-600 border-slate-200', accent: 'text-slate-500', button: 'bg-slate-900 text-white hover:bg-slate-800', input: 'border-slate-200 focus:ring-slate-500', icon: ShieldCheck },
    starter: { container: 'bg-gradient-to-br from-white to-emerald-50 border-emerald-200 shadow-sm', badge: 'bg-emerald-500 text-white border-emerald-600 shadow-sm', accent: 'text-emerald-600', button: 'bg-emerald-600 text-white hover:bg-emerald-700', input: 'border-emerald-100 focus:ring-emerald-500', icon: ShieldCheck },
    pro:     { container: 'bg-gradient-to-br from-white to-indigo-50 border-indigo-200 shadow-md', badge: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-700', accent: 'text-indigo-600', button: 'bg-indigo-600 text-white hover:bg-indigo-700', input: 'border-indigo-100 focus:ring-indigo-500', icon: Crown },
    premium: { container: 'bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg', badge: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-700', accent: 'text-purple-600', button: 'bg-purple-600 text-white hover:bg-purple-700', input: 'border-purple-100 focus:ring-purple-500', icon: Crown },
    sigma:   { container: 'bg-slate-950 border-fuchsia-500/50 shadow-xl text-white', badge: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white border-fuchsia-400 animate-pulse', accent: 'text-fuchsia-400', button: 'bg-fuchsia-600 text-white hover:bg-fuchsia-700', input: 'bg-slate-900 border-slate-800 focus:border-fuchsia-500 text-white', icon: Flame },
    alpha:   { container: 'bg-slate-950 border-red-500/50 shadow-2xl text-white', badge: 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-400', accent: 'text-red-400', button: 'bg-red-600 text-white hover:bg-red-700', input: 'bg-slate-900 border-slate-800 focus:border-red-500 text-white', icon: Flame },
  }

  const style = tierStyles[currentTier] || tierStyles.free
  const TierIcon = style.icon

  if (!isEditing) {
    return (
      <div className={`relative overflow-hidden card p-6 md:p-8 rounded-3xl border transition-all duration-500 ${style.container}`}>
        {activating && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm rounded-3xl">
            <Loader2 size={32} className="animate-spin text-indigo-500" />
            <p className="text-sm font-semibold text-indigo-600">Activating your plan…</p>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
          <div className="relative">
            <div className={`w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 ${isPaid ? 'border-white/20 shadow-xl' : 'border-slate-100'}`}>
              <img
                src={values.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(values.full_name || 'User')}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            {isPaid && (
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-lg shadow-lg text-indigo-600 border border-indigo-50">
                <TierIcon size={16} />
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black tracking-tight leading-tight">{values.full_name || 'New Member'}</h1>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${style.badge}`}>
                  <TierIcon size={10} /> {values.tier || 'Free Tier'}
                </div>
              </div>
              <button onClick={() => setIsEditing(true)} className={`flex items-center justify-center p-3 rounded-xl font-bold transition-all active:scale-95 ${style.button}`}>
                <Pencil size={16} />
              </button>
            </div>

            <p className="text-md font-medium opacity-80 line-clamp-3">{values.bio || 'No bio added yet.'}</p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/5">
                <School className={style.accent} size={18} />
                <span className="text-sm font-bold">{values.university || 'No University'}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {values.skills?.map(skill => (
                  <span key={skill} className="px-2 py-1 rounded-lg text-[10px] font-bold border border-current/10 opacity-70">#{skill}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form
      action={async (formData) => { await updateProfile(formData); setIsEditing(false); router.refresh() }}
      className={`card p-6 md:p-8 space-y-6 border-2 rounded-3xl transition-all ${style.container}`}
    >
      <div className="flex items-center justify-between border-b border-current/10 pb-4">
        <h2 className="text-xl font-black uppercase tracking-tighter">Edit Identity</h2>
        <button type="button" onClick={() => setIsEditing(false)} className="hover:text-red-500"><X size={20} /></button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <AvatarUploadField defaultUrl={values.avatar_url} name="avatar_url" />
          <input name="full_name" defaultValue={values.full_name ?? ''} className={`w-full border-2 rounded-xl p-3 outline-none text-sm font-bold ${style.input}`} placeholder="Full Name" />
        </div>
        <div className="space-y-4">
          <textarea name="bio" defaultValue={values.bio ?? ''} className={`w-full border-2 rounded-xl p-3 h-full min-h-[100px] text-sm ${style.input}`} placeholder="Your story..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="university" defaultValue={values.university ?? ''} className={`w-full border-2 rounded-xl p-3 text-sm font-bold ${style.input}`} placeholder="University" />
        <TagInput name="skills" label="" defaultValue={(values.skills || []) as string[]} placeholder="Skills (space separated)" />
      </div>

      <button type="submit" className={`w-full py-4 rounded-xl font-black uppercase flex items-center justify-center gap-2 ${style.button}`}>
        <Check size={18} /> Save Identity
      </button>
    </form>
  )
}
