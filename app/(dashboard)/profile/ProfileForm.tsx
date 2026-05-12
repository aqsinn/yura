'use client'

import TagInput from '@/app/components/common/TagInput'
import AvatarUploadField from '@/app/components/common/AvatarUploadField'
import { updateProfile } from './actions'

export default function ProfileForm({
  defaultValues,
}: {
  defaultValues: {
    full_name?: string | null
    bio?: string | null
    university?: string | null
    skills?: string[]
    avatar_url?: string | null
    tier?: string
  }
}) {
  return (
    <form action={updateProfile} className="card p-8 space-y-4">
      <div className="flex justify-between items-start">
        <div>
          <label className="block text-sm font-medium mb-1">Profile photo</label>
          <AvatarUploadField
            defaultUrl={defaultValues.avatar_url}
            name="avatar_url"
          />
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Current Plan</span>
          <div className="mt-1 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold border border-indigo-100 capitalize">
            {defaultValues.tier || 'free'}
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Full name</label>
        <input
          name="full_name"
          defaultValue={defaultValues.full_name ?? ''}
          className="w-full border rounded-xl p-3"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Bio</label>
        <textarea
          name="bio"
          defaultValue={defaultValues.bio ?? ''}
          className="w-full border rounded-xl p-3 min-h-28"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">University</label>
        <input
          name="university"
          defaultValue={defaultValues.university ?? ''}
          className="w-full border rounded-xl p-3"
        />
      </div>
      <div>
        <TagInput
          name="skills"
          label="Skills"
          defaultValue={(defaultValues.skills || []) as string[]}
          placeholder="react nextjs figma"
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700"
      >
        Save profile
      </button>
    </form>
  )
}
