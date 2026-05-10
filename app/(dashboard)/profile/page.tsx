import { createClient } from '@/utils/supabase/server'
import { updateProfile } from './actions'

export default async function ProfilePage() {
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
          <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
          <input name="skills" defaultValue={(profile?.skills || []).join(', ')} className="w-full border rounded-xl p-3" />
        </div>
        <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700">
          Save profile
        </button>
      </form>
    </div>
  )
}
