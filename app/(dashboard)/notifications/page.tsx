import { createClient } from '@/utils/supabase/server'
import { respondToOffer } from './actions'

type OfferRecord = {
  id: string
  status: string
  projects: { title: string; description: string }[] | null
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: offers } = user
    ? await supabase
        .from('offers')
        .select('id,status,project_id,projects(title,description)')
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
    : { data: [] }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold">Notifications</h1>
      {offers?.length ? offers.map((offer: OfferRecord) => (
        <div key={offer.id} className="card p-6">
          <h3 className="text-lg font-semibold">{offer.projects?.[0]?.title}</h3>
          <p className="text-slate-600 mb-4">{offer.projects?.[0]?.description}</p>
          <p className="text-sm mb-4">Status: <span className="font-medium">{offer.status}</span></p>
          {offer.status === 'pending' && (
            <div className="flex gap-3">
              <form action={respondToOffer}>
                <input type="hidden" name="offer_id" value={offer.id} />
                <input type="hidden" name="decision" value="accepted" />
                <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white">Accept</button>
              </form>
              <form action={respondToOffer}>
                <input type="hidden" name="offer_id" value={offer.id} />
                <input type="hidden" name="decision" value="declined" />
                <button className="px-4 py-2 rounded-xl border">Decline</button>
              </form>
            </div>
          )}
        </div>
      )) : <div className="card p-8 text-slate-600">No notifications yet. You are all caught up.</div>}
    </div>
  )
}
