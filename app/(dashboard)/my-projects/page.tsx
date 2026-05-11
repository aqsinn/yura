import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { respondJoinRequest } from './actions'
import { Bell } from 'lucide-react'
import Avatar from '@/app/components/common/Avatar'

type IncomingOffer = {
  id: string
  status: string
  project_id: string
  sender_id: string
  created_at?: string
}

type SentOffer = {
  id: string
  status: string
  project_id: string
  receiver_id: string
  created_at?: string
}

export default async function MyProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; created?: string }>
}) {
  const { saved, error, created } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: myProjects } = user
    ? await supabase
        .from('projects')
        .select('id,title,description,status,created_at')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const myProjectIds = (myProjects || []).map((p) => p.id)

  const [
    { data: requestsByReceiverRaw, error: requestsByReceiverError },
    { data: requestsByOwnedProjectsRaw, error: requestsByOwnedProjectsError },
    { data: sentRequestsRaw, error: sentError },
  ] = await Promise.all([
    user
      ? supabase
          .from('offers')
          .select(`
            id,
            status,
            project_id,
            sender_id,
            created_at
          `)
          .eq('receiver_id', user.id)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    user && myProjectIds.length
      ? supabase
          .from('offers')
          .select(`
            id,
            status,
            project_id,
            sender_id,
            receiver_id,
            created_at
          `)
          .in('project_id', myProjectIds)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    user
      ? supabase
          .from('offers')
          .select(`
            id,
            status,
            project_id,
            receiver_id,
            created_at
          `)
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: [], error: null }),
  ])

  if (requestsByReceiverError) console.error('Incoming (receiver) error:', requestsByReceiverError)
  if (requestsByOwnedProjectsError) console.error('Incoming (owned projects) error:', requestsByOwnedProjectsError)
  if (sentError) console.error('Sent requests error:', sentError)

  const joinRequests = (() => {
    const a = (requestsByReceiverRaw || []) as unknown as IncomingOffer[]
    const b = (requestsByOwnedProjectsRaw || []) as unknown as IncomingOffer[]
    const byId = new Map<string, IncomingOffer>()
    for (const r of [...a, ...b]) byId.set(r.id, r)
    return Array.from(byId.values())
  })()
  const sentRequests = (sentRequestsRaw || []) as unknown as SentOffer[]

  const projectIds = Array.from(
    new Set([
      ...joinRequests.map((r) => r.project_id),
      ...sentRequests.map((r) => r.project_id),
    ])
  )

  const profileIds = Array.from(
    new Set([
      ...joinRequests.map((r) => r.sender_id),
      ...sentRequests.map((r) => r.receiver_id),
    ])
  )

  const [{ data: projectsRows }, { data: profilesRows }] = await Promise.all([
    projectIds.length
      ? supabase.from('projects').select('id,title').in('id', projectIds)
      : Promise.resolve({ data: [] }),
    profileIds.length
      ? supabase.from('profiles').select('id,full_name,avatar_url').in('id', profileIds)
      : Promise.resolve({ data: [] }),
  ])

  const projectTitleById: Record<string, string> = {}
  for (const p of projectsRows || []) projectTitleById[p.id] = p.title

  const profileById: Record<string, { full_name: string | null; avatar_url: string | null }> = {}
  for (const p of profilesRows || []) profileById[p.id] = p

  const pendingByProject: Record<string, number> = {}
  for (const r of joinRequests as unknown as IncomingOffer[]) {
    if (r.status === 'pending') {
      pendingByProject[r.project_id] = (pendingByProject[r.project_id] || 0) + 1
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">My projects</h1>
      {created ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">Project published successfully.</div> : null}
      {saved ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">Updated successfully.</div> : null}
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 break-words">{error}</div> : null}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Created by me</h2>
        <div className="grid gap-4">
          {myProjects?.length ? myProjects.map((project) => {
          const pendingCount = pendingByProject[project.id] || 0
          return (
            <div key={project.id} className="card p-5 relative">
              {pendingCount > 0 && (
                <span className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
                  <Bell size={12} />
                  {pendingCount} new request{pendingCount > 1 ? 's' : ''}
                </span>
              )}
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-slate-600 mt-1">{project.description}</p>
                </div>
                <Link href={`/projects/${project.id}`} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">Open</Link>
              </div>
            </div>
          )
        }) : <div className="card p-8 text-slate-600">You have not created projects yet.</div>}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Incoming requests</h2>
        {requestsByReceiverError || requestsByOwnedProjectsError ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4 text-sm">
            Could not load incoming requests due to database permissions (RLS). Run the SQL in the message I sent to allow project owners to view requests for their own projects.
          </div>
        ) : null}
        <div className="grid gap-4">
          {joinRequests.length ? joinRequests.map((offer) => (
            <div key={offer.id} className="card p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const profile = profileById[offer.sender_id]
                    const projectTitle = projectTitleById[offer.project_id]
                    return (
                      <>
                        <Avatar src={profile?.avatar_url} name={profile?.full_name} size="md" />
                        <div>
                          <p className="font-medium">
                            {profile?.full_name || 'A student'} requested to join
                          </p>
                          <p className="text-slate-600 text-sm">
                            Project: {projectTitle || 'Unknown project'}
                          </p>
                          <p className="text-slate-600 text-sm">Status: <span className="capitalize">{offer.status}</span></p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                {offer.status === 'pending' ? (
                  <div className="flex gap-2">
                    <form action={respondJoinRequest}>
                      <input type="hidden" name="offer_id" value={offer.id} />
                      <input type="hidden" name="decision" value="accepted" />
                      <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">Accept</button>
                    </form>
                    <form action={respondJoinRequest}>
                      <input type="hidden" name="offer_id" value={offer.id} />
                      <input type="hidden" name="decision" value="declined" />
                      <button className="px-4 py-2 rounded-xl border text-sm">Decline</button>
                    </form>
                  </div>
                ) : null}
              </div>
            </div>
          )) : <div className="card p-8 text-slate-600">No incoming join requests yet.</div>}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Sent by me</h2>
        <div className="grid gap-4">
          {sentRequests.length ? sentRequests.map((offer) => (
            <div key={offer.id} className="card p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  {(() => {
                    const profile = profileById[offer.receiver_id]
                    const projectTitle = projectTitleById[offer.project_id]
                    return (
                      <>
                        <Avatar src={profile?.avatar_url} name={profile?.full_name} size="md" />
                        <div>
                          <p className="font-medium">You requested to join</p>
                          <p className="text-slate-600 text-sm">
                            Project: {projectTitle || 'Unknown project'}
                          </p>
                          <p className="text-slate-600 text-sm">
                            Owner: {profile?.full_name || 'Project Owner'}
                          </p>
                          <p className="text-slate-600 text-sm">Status: <span className="capitalize">{offer.status}</span></p>
                        </div>
                      </>
                    )
                  })()}
                </div>
                <Link href={`/projects/${offer.project_id}`} className="px-4 py-2 rounded-xl border text-sm text-center">View Project</Link>
              </div>
            </div>
          )) : <div className="card p-8 text-slate-600">You have not sent any join requests yet.</div>}
        </div>
      </section>
    </div>
  )
}
