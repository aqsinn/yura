import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { respondJoinRequest } from './actions'

type JoinRequest = {
  id: string
  status: string
  project_id: string
  sender_id: string
  projects: { title: string }[] | null
  sender_profile: { full_name: string | null }[] | null
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

  const { data: requestsRaw } = user
    ? await supabase
        .from('offers')
        .select('id,status,project_id,sender_id,projects(title),sender_profile:profiles!offers_sender_id_fkey(full_name)')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  const joinRequests = (requestsRaw || []) as JoinRequest[]

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">My projects</h1>
      {created ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">Project published successfully.</div> : null}
      {saved ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">Updated successfully.</div> : null}
      {error ? <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 p-4 break-words">{error}</div> : null}

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Created by me</h2>
        <div className="grid gap-4">
          {myProjects?.length ? myProjects.map((project) => (
            <div key={project.id} className="card p-5">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-slate-600 mt-1">{project.description}</p>
                </div>
                <Link href={`/projects/${project.id}`} className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm">Open</Link>
              </div>
            </div>
          )) : <div className="card p-8 text-slate-600">You have not created projects yet.</div>}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Join requests</h2>
        <div className="grid gap-4">
          {joinRequests.length ? joinRequests.map((offer) => (
            <div key={offer.id} className="card p-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-medium">{offer.sender_profile?.[0]?.full_name || 'A student'} requested to join</p>
                  <p className="text-slate-600 text-sm">Project: {offer.projects?.[0]?.title || 'Unknown project'}</p>
                  <p className="text-slate-600 text-sm">Status: {offer.status}</p>
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
    </div>
  )
}
