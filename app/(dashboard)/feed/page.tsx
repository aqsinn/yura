import { createClient } from '@/utils/supabase/server'
import ProjectCard from '@/app/components/projects/ProjectCard'
import MessagesWidget from '@/app/components/messaging/MessagesWidget'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; category?: string; timeline?: string; created?: string }>
}) {
  const { skill, category, timeline, created } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('projects')
    .select('*, creator_id, profiles:creator_id(full_name, avatar_url)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (timeline) query = query.eq('timeline', timeline)
  if (skill) query = query.contains('required_skills', [skill])

  const { data: projects } = await query

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: profile }, { data: userRequests }, { data: userMemberships }] = await Promise.all([
    user
      ? supabase.from('profiles').select('skills, tier').eq('id', user.id).single()
      : Promise.resolve({ data: null }),
    user
      ? supabase.from('offers').select('project_id, status').eq('sender_id', user.id)
      : Promise.resolve({ data: [] }),
    user
      ? supabase.from('project_members').select('project_id').eq('profile_id', user.id)
      : Promise.resolve({ data: [] }),
  ])

  const userSkills: string[] = (profile?.skills as string[] | null) ?? []
  const userTier = profile?.tier ?? 'free'
  const requestedProjectIds = new Set(userRequests?.map((r) => r.project_id) || [])
  const joinedProjectIds = new Set(userMemberships?.map((m) => m.project_id) || [])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {created ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">Project published successfully.</div> : null}
      
      {userTier === 'free' && (
        <Link 
          href="/profile#pricing" 
          className="group relative block overflow-hidden rounded-2xl bg-indigo-600 p-6 text-white transition-all hover:bg-indigo-700 shadow-lg shadow-indigo-200"
        >
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white/20 p-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Boost your profile with AlphaMaxed</h3>
                <p className="text-indigo-100">Get AI matching, featured badges, and unlimited project reach.</p>
              </div>
            </div>
            <span className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-indigo-600 transition-transform group-hover:scale-105">
              Upgrade Now
            </span>
          </div>
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-all group-hover:scale-150" />
          <div className="absolute -bottom-8 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-indigo-400/20 blur-3xl" />
        </Link>
      )}

      <div className="flex justify-between items-start">
        <header>
          <h2 className="text-4xl font-semibold tracking-tight">Recommended projects</h2>
          <p className="text-slate-600">Projects matched for your interests and skills.</p>
        </header>
        <div className="mt-2">
          <MessagesWidget />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6">
        {projects?.length ? projects.map((project, i) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={i}
            userSkills={userSkills}
            currentUserId={user?.id}
            hasRequested={requestedProjectIds.has(project.id)}
            hasJoined={joinedProjectIds.has(project.id)}
          />
        )) : <div className="card p-8 text-slate-600">No projects yet. Create one to kick things off.</div>}
      </div>
    </div>
  )
}
