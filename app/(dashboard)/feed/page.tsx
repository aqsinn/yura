import { createClient } from '@/utils/supabase/server'
import ProjectCard from '@/app/components/projects/ProjectCard'

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; category?: string; timeline?: string; created?: string }>
}) {
  const { skill, category, timeline, created } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('projects')
    .select('*, profiles(full_name)')
    .order('created_at', { ascending: false })

  if (category) query = query.eq('category', category)
  if (timeline) query = query.eq('timeline', timeline)
  if (skill) query = query.contains('required_skills', [skill])

  const { data: projects } = await query

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {created ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">Project published successfully.</div> : null}
      <header>
        <h2 className="text-4xl font-semibold tracking-tight">Recommended projects</h2>
        <p className="text-slate-600">Projects matched for your interests and skills.</p>
      </header>
      <div className="grid grid-cols-1 gap-6">
        {projects?.length ? projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        )) : <div className="card p-8 text-slate-600">No projects yet. Create one to kick things off.</div>}
      </div>
    </div>
  )
}
