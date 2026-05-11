'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function respondJoinRequest(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const offerId = String(formData.get('offer_id') || '')
  const decision = String(formData.get('decision') || '')
  if (!offerId || !['accepted', 'declined'].includes(decision)) return

  const { data: offer, error } = await supabase
    .from('offers')
    .update({ status: decision })
    .eq('id', offerId)
    .eq('receiver_id', user.id)
    .select('project_id,sender_id')
    .single()

  if (error || !offer) {
    redirect(`/my-projects?error=${encodeURIComponent(error?.message || 'Failed to update request')}`)
  }

  if (decision === 'accepted') {
    const { error: memberError } = await supabase.from('project_members').upsert({
      project_id: offer.project_id,
      profile_id: offer.sender_id,
      role: 'member',
      status: 'active',
    })
    if (memberError) {
      redirect(`/my-projects?error=${encodeURIComponent(memberError.message)}`)
    }
  }

  revalidatePath('/my-projects')
  revalidatePath('/projects/[id]')
  redirect(`/my-projects?saved=1`)
}
