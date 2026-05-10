'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function respondToOffer(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const offerId = String(formData.get('offer_id') || '')
  const decision = String(formData.get('decision') || '')
  if (!offerId || !['accepted', 'declined'].includes(decision)) return

  const { data: offer } = await supabase
    .from('offers')
    .update({ status: decision })
    .eq('id', offerId)
    .eq('receiver_id', user.id)
    .select('project_id')
    .single()

  if (offer && decision === 'accepted') {
    await supabase.from('project_members').upsert({
      project_id: offer.project_id,
      profile_id: user.id,
      status: 'active',
      role: 'member',
    })
  }

  revalidatePath('/notifications')
}
