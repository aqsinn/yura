import { notFound } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

type ProjectMember = {
  profile_id: string
  role: string
  status: string
  profiles: { full_name: string | null }[] | null
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (!project) return notFound()

  const { data: members } = await supabase
    .from('project_members')
    .select('profile_id, role, status, profiles(full_name)')
    .eq('project_id', id)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="card p-8">
        <h1 className="text-3xl font-semibold mb-3">{project.title}</h1>
        <p className="text-slate-600 mb-6">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {(project.required_skills || []).map((skill: string) => (
            <span key={skill} className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs">{skill}</span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: project.team_size || 1 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-3 text-sm text-slate-600">
              Slot {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-3">Team members</h2>
        <div className="space-y-2">
          {members?.length ? members.map((member: ProjectMember) => (
            <div key={member.profile_id} className="flex justify-between border rounded-xl p-3">
              <span>{member.profiles?.[0]?.full_name || 'Unknown'}</span>
              <span className="text-slate-600 text-sm">{member.role}</span>
            </div>
          )) : <p className="text-slate-600">No members joined yet.</p>}
        </div>
      </div>
    </div>
  )
}
