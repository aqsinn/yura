import { createClient } from '@/utils/supabase/server'

export async function getOffersForUser(userId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('offers')
    .select('*, projects(title,description)')
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
