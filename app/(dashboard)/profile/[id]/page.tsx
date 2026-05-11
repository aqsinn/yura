import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function ProfileViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ saved?: string }>
}) {
  const { id } = await params
  const { saved } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) return notFound()

  const isOwnProfile = user?.id === id

  // Get projects created by this user
  const { data: projects } = await supabase
    .from('projects')
    .select('id, title, description, status')
    .eq('creator_id', id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">
          Profile saved successfully.
        </div>
      )}
      <div className="card p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-semibold">{profile.full_name || 'Anonymous Student'}</h1>
            {profile.headline && (
              <p className="text-lg text-slate-600 mt-1">{profile.headline}</p>
            )}
            {profile.university && (
              <p className="text-slate-500 mt-1">{profile.university}</p>
            )}
          </div>
          {isOwnProfile && (
            <Link
              href="/profile"
              className="px-4 py-2 rounded-xl border text-sm hover:bg-slate-50"
            >
              Edit Profile
            </Link>
          )}
        </div>

        {profile.bio && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-slate-500 mb-2">About</h2>
            <p className="text-slate-700">{profile.bio}</p>
          </div>
        )}

        {profile.skills?.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-medium text-slate-500 mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill: string) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profile.portfolio_links?.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-slate-500 mb-2">Portfolio</h2>
            <div className="flex flex-wrap gap-2">
              {profile.portfolio_links.map((link: string) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline text-sm"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {projects?.length ? (
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Projects</h2>
          <div className="space-y-3">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="block p-4 border rounded-xl hover:bg-slate-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-slate-600 text-sm line-clamp-1">{project.description}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-slate-100 rounded-full">{project.status}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
