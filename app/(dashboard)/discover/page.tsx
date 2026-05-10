import { createClient } from '@/utils/supabase/server'

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string }>
}) {
  const { skill } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('profiles').select('id, full_name, bio, university, skills').order('created_at', { ascending: false })
  if (skill) query = query.contains('skills', [skill.toLowerCase()])
  const { data: profiles } = await query

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">Discover students</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {profiles?.length ? profiles.map((profile) => (
          <div key={profile.id} className="card p-6">
            <h3 className="text-lg font-semibold">{profile.full_name || 'Anonymous Student'}</h3>
            <p className="text-slate-600 text-sm mb-2">{profile.university}</p>
            <p className="text-slate-600 mb-4">{profile.bio || 'No bio yet.'}</p>
            <div className="flex flex-wrap gap-2">
              {(profile.skills || []).map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs">{tag}</span>
              ))}
            </div>
          </div>
        )) : <div className="card p-8 text-slate-600">No students found for this filter.</div>}
      </div>
    </div>
  )
}
