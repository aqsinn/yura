import { createClient } from '@/utils/supabase/server'

export async function getProfilesBySkill(skill?: string) {
  const supabase = await createClient()
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false })

  if (skill) {
    query = query.contains('skills', [skill.toLowerCase()])
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}
