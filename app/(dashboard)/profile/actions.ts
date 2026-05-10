'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const skills = Array.from(
    new Set(
      String(formData.get('skills') || '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    )
  )

  await supabase.from('profiles').upsert({
    id: user.id,
    full_name: String(formData.get('full_name') || ''),
    bio: String(formData.get('bio') || ''),
    university: String(formData.get('university') || ''),
    skills,
  })

  if (skills.length) {
    await supabase.from('skills').upsert(
      skills.map((slug) => ({
        slug,
        name: slug.replace(/(^\w|\s\w)/g, (c) => c.toUpperCase()),
        category: 'engineering',
      })),
      { onConflict: 'slug' }
    )
  }

  await supabase.from('profile_skills').delete().eq('profile_id', user.id)

  if (skills.length) {
    const { data: skillRows } = await supabase.from('skills').select('id,slug').in('slug', skills)
    if (skillRows?.length) {
      await supabase.from('profile_skills').insert(
        skillRows.map((skill) => ({
          profile_id: user.id,
          skill_id: skill.id,
        }))
      )
    }
  }

  revalidatePath('/profile')
}
