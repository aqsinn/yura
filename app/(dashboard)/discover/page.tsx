import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string }>
}) {
  const { skill } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Build query - exclude current user and only show profiles with a name or skills
  let query = supabase
    .from('profiles')
    .select('id, full_name, bio, university, skills')
    .order('created_at', { ascending: false })

  // Exclude current user from discover
  if (user) {
    query = query.neq('id', user.id)
  }

  if (skill) {
    query = query.contains('skills', [skill.toLowerCase()])
  }

  const { data: profiles } = await query

  // Filter to show only profiles that have at least a name or some skills
  const visibleProfiles = profiles?.filter(
    (p) => p.full_name || (p.skills && p.skills.length > 0)
  )

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">Discover students</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {visibleProfiles?.length ? visibleProfiles.map((profile) => (
          <div key={profile.id} className="card p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{profile.full_name || 'Anonymous Student'}</h3>
                <p className="text-slate-600 text-sm">{profile.university}</p>
              </div>
              <Link
                href={`/profile/${profile.id}`}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-sm hover:bg-indigo-700"
              >
                View
              </Link>
            </div>
            <p className="text-slate-600 mb-4 line-clamp-2">{profile.bio || 'No bio yet.'}</p>
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
