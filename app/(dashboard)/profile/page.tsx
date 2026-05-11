import { createClient } from '@/utils/supabase/server'
import { updateProfile } from './actions'
import TagInput from '@/app/components/common/TagInput'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>
}) {
  const { saved, error } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = user
    ? await supabase.from('profiles').select('*').eq('id', user.id).single()
    : { data: null }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">Your profile</h1>
      {saved ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">
          Saved successfully.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 break-words">
          {error}
        </div>
      ) : null}
      <form action={updateProfile} className="card p-8 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input name="full_name" defaultValue={profile?.full_name ?? ''} className="w-full border rounded-xl p-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea name="bio" defaultValue={profile?.bio ?? ''} className="w-full border rounded-xl p-3 min-h-28" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">University</label>
          <input name="university" defaultValue={profile?.university ?? ''} className="w-full border rounded-xl p-3" />
        </div>
        <div>
          <TagInput
            name="skills"
            label="Skills"
            defaultValue={(profile?.skills || []) as string[]}
            placeholder="react nextjs figma"
          />
        </div>
        <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700">
          Save profile
        </button>
      </form>
    </div>
  )
}
