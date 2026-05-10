import { createClient } from '@/utils/supabase/server'

export async function getOpenProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*, profiles(full_name)')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}
