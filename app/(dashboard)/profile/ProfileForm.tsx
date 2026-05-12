'use client'

import { useState } from 'react'
import TagInput from '@/app/components/common/TagInput'
import AvatarUploadField from '@/app/components/common/AvatarUploadField'
import { updateProfile } from './actions'
import { Pencil, School, Check, X, ShieldCheck, Crown, Flame } from 'lucide-react'

type UserTier = 'free' | 'starter' | 'pro' | 'premium' | 'sigma' | 'alpha';

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: {
    full_name?: string | null
    bio?: string | null
    university?: string | null
    skills?: string[]
    avatar_url?: string | null
    tier?: UserTier | string
  }
}) {
  const [isEditing, setIsEditing] = useState(false)
  const currentTier = (defaultValues.tier?.toLowerCase() || 'free') as UserTier;
  const isPaid = currentTier !== 'free';

  // COOLNESS DEFINITIONS
  const tierStyles: Record<UserTier, { 
    container: string; 
    badge: string; 
    accent: string; 
    button: string; 
    input: string;
    icon: any;
  }> = {
    free: {
      container: 'bg-white border-slate-200',
      badge: 'bg-slate-100 text-slate-600 border-slate-200',
      accent: 'text-slate-500',
      button: 'bg-slate-900 text-white hover:bg-slate-800',
      input: 'border-slate-200 focus:ring-slate-500',
      icon: ShieldCheck
    },
    starter: {
      container: 'bg-gradient-to-br from-white to-emerald-50 border-emerald-200 shadow-md',
      badge: 'bg-gradient-to-r from-emerald-500 to-green-500 text-white border-emerald-600 shadow-sm',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200',
      input: 'border-emerald-100 focus:ring-emerald-500',
      icon: ShieldCheck
    },
    pro: {
      container: 'bg-gradient-to-br from-white to-indigo-50 border-indigo-200 shadow-lg',
      badge: 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-700 shadow-md',
      accent: 'text-indigo-600',
      button: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200',
      input: 'border-indigo-100 focus:ring-indigo-500',
      icon: Crown
    },
    premium: {
      container: 'bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-xl',
      badge: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-700 shadow-lg',
      accent: 'text-purple-600',
      button: 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-200',
      input: 'border-purple-100 focus:ring-purple-500',
      icon: Crown
    },
    sigma: {
      container: 'bg-slate-950 border-fuchsia-500/50 shadow-[0_0_30px_rgba(192,38,211,0.15)] text-white',
      badge: 'bg-gradient-to-r from-fuchsia-600 to-purple-600 text-white border-fuchsia-400 animate-pulse',
      accent: 'text-fuchsia-400',
      button: 'bg-fuchsia-600 text-white hover:bg-fuchsia-700 hover:shadow-[0_0_20px_rgba(192,38,211,0.5)]',
      input: 'bg-slate-900 border-slate-800 focus:border-fuchsia-500 text-white',
      icon: Flame
    },
    alpha: {
      container: 'bg-slate-950 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.2)] text-white',
      badge: 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-red-400 uppercase italic tracking-tighter',
      accent: 'text-red-400',
      button: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-[0_0_25px_rgba(239,68,68,0.5)]',
      input: 'bg-slate-900 border-slate-800 focus:border-red-500 text-white',
      icon: Flame
    }
  }

  const style = tierStyles[currentTier] || tierStyles.free;
  const TierIcon = style.icon;

  // VIEW MODE
  if (!isEditing) {
    return (
      <div className={`relative overflow-hidden card p-8 md:p-12 rounded-[2rem] border transition-all duration-700 ${style.container}`}>
        {/* Decorative background element for paid users */}
        {isPaid && (
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-current opacity-[0.03] rounded-full blur-3xl pointer-events-none" />
        )}

        <div className="flex flex-col md:flex-row gap-10 items-center md:items-start relative z-10">
          <div className="relative group">
            <div className={`w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 transition-transform duration-500 group-hover:scale-105 ${isPaid ? 'border-white/20 shadow-2xl' : 'border-slate-100'}`}>
               <img 
                src={defaultValues.avatar_url || 'https://ui-avatars.com/api/?name=' + (defaultValues.full_name || 'User')} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {isPaid && <div className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg text-indigo-600 border border-indigo-50"><TierIcon size={20} /></div>}
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-3">
                  {defaultValues.full_name || 'New Member'}
                </h1>
                <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${style.badge}`}>
                  <TierIcon size={12} /> {defaultValues.tier || 'Free Tier'}
                </div>
              </div>
              <button 
                onClick={() => setIsEditing(true)}
                className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold transition-all active:scale-95 ${style.button}`}
              >
                <Pencil size={18} /> Edit Profile
              </button>
            </div>

            <p className={`text-lg md:text-xl font-medium leading-relaxed max-w-2xl opacity-80 italic`}>
              "{defaultValues.bio || "This user is keeping a low profile..."}"
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-current/5">
                <School className={style.accent} size={24} />
                <div>
                  <p className="text-[10px] uppercase font-black opacity-50 tracking-widest">University</p>
                  <p className="font-bold">{defaultValues.university || 'Not specified'}</p>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <p className={`text-[10px] uppercase font-black tracking-[0.3em] mb-4 opacity-50`}>Technical Arsenal</p>
              <div className="flex flex-wrap gap-2">
                {defaultValues.skills?.length ? defaultValues.skills.map(skill => (
                  <span key={skill} className={`px-4 py-2 rounded-xl text-xs font-bold border ${isPaid ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                    #{skill}
                  </span>
                )) : <span className="text-sm opacity-40">No skills listed yet</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // EDIT MODE
  return (
    <form 
      action={async (formData) => {
        const result = await updateProfile(formData);
        setIsEditing(false);
      }} 
      className={`card p-8 md:p-10 space-y-8 border-2 transition-all duration-500 rounded-[2rem] ${style.container}`}
    >
      <div className="flex items-center justify-between border-b border-current/10 pb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${style.badge}`}><Pencil size={20} /></div>
          <h2 className="text-2xl font-black tracking-tight">Modify Identity</h2>
        </div>
        <button 
          type="button" 
          onClick={() => setIsEditing(false)}
          className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div>
            <label className={`block text-[10px] font-black uppercase tracking-widest mb-3 opacity-60`}>Profile Visual</label>
            <AvatarUploadField defaultUrl={defaultValues.avatar_url} name="avatar_url" />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Display Name</label>
              <input
                name="full_name"
                defaultValue={defaultValues.full_name ?? ''}
                className={`w-full border-2 rounded-2xl p-4 outline-none transition-all font-bold ${style.input}`}
                placeholder="How shall we call you?"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Institution</label>
              <input
                name="university"
                defaultValue={defaultValues.university ?? ''}
                className={`w-full border-2 rounded-2xl p-4 outline-none transition-all font-bold ${style.input}`}
                placeholder="Where do you study?"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">The Narrative (Bio)</label>
            <textarea
              name="bio"
              defaultValue={defaultValues.bio ?? ''}
              className={`w-full border-2 rounded-2xl p-4 min-h-[120px] outline-none transition-all font-medium ${style.input}`}
              placeholder="Tell your story..."
            />
          </div>

          <div>
            <TagInput
              name="skills"
              label="Skillset (Space separated)"
              defaultValue={(defaultValues.skills || []) as string[]}
              placeholder="python typescript design"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-[0.97] ${style.button}`}
        >
          <Check size={24} /> Update Profile
        </button>
      </div>
    </form>
  )
}