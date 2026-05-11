'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const skills = Array.from(
    new Set(
      String(formData.get('skills') || '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    )
  )

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    full_name: String(formData.get('full_name') || ''),
    bio: String(formData.get('bio') || ''),
    university: String(formData.get('university') || ''),
    skills,
    avatar_url: String(formData.get('avatar_url') || '') || null,
  })
  if (profileError) redirect(`/profile?error=${encodeURIComponent(profileError.message)}`)

  if (skills.length) {
    const { error: skillsError } = await supabase.from('skills').upsert(
      skills.map((slug) => ({
        slug,
        name: slug.replace(/(^\w|\s\w)/g, (c) => c.toUpperCase()),
        category: 'engineering',
      })),
      { onConflict: 'slug' }
    )
    if (skillsError) redirect(`/profile?error=${encodeURIComponent(`Skills upsert failed: ${skillsError.message}`)}`)
  }

  const { error: deleteError } = await supabase.from('profile_skills').delete().eq('profile_id', user.id)
  if (deleteError) redirect(`/profile?error=${encodeURIComponent(`Skills reset failed: ${deleteError.message}`)}`)

  if (skills.length) {
    const { data: skillRows } = await supabase.from('skills').select('id,slug').in('slug', skills)
    if (skillRows?.length) {
      const { error: insertError } = await supabase.from('profile_skills').insert(
        skillRows.map((skill) => ({
          profile_id: user.id,
          skill_id: skill.id,
        }))
      )
      if (insertError) redirect(`/profile?error=${encodeURIComponent(`Skills link failed: ${insertError.message}`)}`)
    }
  }

  revalidatePath('/profile')
  revalidatePath(`/profile/${user.id}`)
  revalidatePath('/discover')
  redirect(`/profile/${user.id}?saved=1`)
}
