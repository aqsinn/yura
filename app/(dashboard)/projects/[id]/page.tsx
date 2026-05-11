import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { requestToJoinProject } from './actions'
import Avatar from '@/app/components/common/Avatar'

type ProjectMember = {
  profile_id: string
  role: string
  status: string
  profiles: { full_name: string | null; avatar_url: string | null } | { full_name: string | null; avatar_url: string | null }[] | null
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ requested?: string; error?: string }>
}) {
  const { id } = await params
  const { requested, error } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: project } = await supabase
    .from('projects')
    .select('*, creator:creator_id(id, full_name)')
    .eq('id', id)
    .single()

  if (!project) return notFound()

  const isOwner = user?.id === project.creator_id
  const creator = project.creator as { id: string; full_name: string | null } | null

  const [{ data: members }, { data: existingOffer }] = await Promise.all([
    supabase
      .from('project_members')
      .select('profile_id, role, status, profiles:profile_id(full_name, avatar_url)')
      .eq('project_id', id),
    user
      ? supabase
          .from('offers')
          .select('status')
          .eq('project_id', id)
          .eq('sender_id', user.id)
          .single()
      : Promise.resolve({ data: null }),
  ])

  const hasJoined = members?.some((m) => m.profile_id === user?.id)
  const hasRequested = !!existingOffer

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {requested ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">Join request sent to the project owner.</div> : null}
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 break-words">{error}</div> : null}
      <div className="card p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-slate-500 text-sm">Created by</span>
          <Link
            href={`/profile/${project.creator_id}`}
            className="text-indigo-600 hover:underline text-sm font-medium"
          >
            {creator?.full_name || 'Anonymous'}
          </Link>
        </div>
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
        {!isOwner && user ? (
          <div className="mt-6">
            {hasJoined ? (
              <div className="px-6 py-3 bg-emerald-50 text-emerald-700 font-medium rounded-xl border border-emerald-200 inline-block">
                You are a member
              </div>
            ) : hasRequested ? (
              <div className="px-6 py-3 bg-amber-50 text-amber-700 font-medium rounded-xl border border-amber-200 inline-block">
                Request Pending
              </div>
            ) : (
              <form action={requestToJoinProject}>
                <input type="hidden" name="project_id" value={project.id} />
                <input type="hidden" name="owner_id" value={project.creator_id} />
                <button className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all">
                  Request to join
                </button>
              </form>
            )}
          </div>
        ) : null}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-3">Team members</h2>
        <div className="space-y-3">
          {members?.length ? members.map((member: ProjectMember) => (
            <div key={member.profile_id} className="flex justify-between items-center border rounded-xl p-3">
              <div className="flex items-center gap-3">
                {(() => {
                  const p = Array.isArray(member.profiles) ? member.profiles[0] : member.profiles
                  return (
                    <>
                      <Avatar src={p?.avatar_url} name={p?.full_name} size="sm" />
                      <Link
                        href={`/profile/${member.profile_id}`}
                        className="text-indigo-600 hover:underline font-medium"
                      >
                        {p?.full_name || 'Unknown'}
                      </Link>
                    </>
                  )
                })()}
              </div>
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg capitalize">{member.role}</span>
            </div>
          )) : <p className="text-slate-600">No members joined yet.</p>}
        </div>
      </div>
    </div>
  )
}
