'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Define limits for each tier
const TIER_LIMITS: Record<string, number> = {
  free: 3,      // Max 3 team members
  starter: 10,  // Max 10 team members
  pro: 25,      // Max 25 team members
  premium: 100, // Effectively unlimited
  sigma: 500,
  alpha: 9999,
}

export async function respondJoinRequest(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const offerId = String(formData.get('offer_id') || '')
  const decision = String(formData.get('decision') || '')
  if (!offerId || !['accepted', 'declined'].includes(decision)) return

  // 1. Fetch the user's tier to check limits
  const { data: profile } = await supabase
    .from('profiles')
    .select('tier')
    .eq('id', user.id)
    .single()

  const userTier = profile?.tier?.toLowerCase() || 'free'
  const memberLimit = TIER_LIMITS[userTier] || TIER_LIMITS.free

  if (decision === 'accepted') {
    // 2. Fetch the offer to get the project_id
    const { data: offerData } = await supabase
      .from('offers')
      .select('project_id, sender_id')
      .eq('id', offerId)
      .single()

    if (offerData) {
      // 3. Count current members in this project
      const { count, error: countError } = await supabase
        .from('project_members')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', offerData.project_id)

      // 4. BLOCK if over limit
      if (count !== null && count >= memberLimit) {
        redirect(`/my-projects?error=${encodeURIComponent(`Limit reached! Your ${userTier} plan only allows ${memberLimit} members. Upgrade to add more.`)}`)
      }
    }
  }

  // 5. Proceed with updating the offer
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

  // 6. Finalize membership
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