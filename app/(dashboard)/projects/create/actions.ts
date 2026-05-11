'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

function parseSkills(raw: string) {
  return Array.from(
    new Set(
      raw
    .split(',')
    .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    )
  )
}

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to create a project.')
  }

  const title = String(formData.get('title') || '')
  const description = String(formData.get('description') || '')
  const category = String(formData.get('category') || 'general')
  const timeline = String(formData.get('timeline') || '1-2 months')
  const teamSize = Number(formData.get('team_size') || 3)
  const requiredSkills = parseSkills(String(formData.get('skills') || ''))

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      creator_id: user.id,
      title,
      description,
      category,
      timeline,
      team_size: teamSize,
      required_skills: requiredSkills,
      status: 'open',
    })
    .select('id')
    .single()

  if (error || !project) {
    throw new Error(error?.message || 'Failed to create project.')
  }

  if (requiredSkills.length) {
    const { error: skillsUpsertError } = await supabase.from('skills').upsert(
      requiredSkills.map((slug) => ({
        slug,
        name: slug.replace(/(^\w|\s\w)/g, (c) => c.toUpperCase()),
        category: category === 'design' || category === 'business' ? category : 'engineering',
      })),
      { onConflict: 'slug' }
    )
    if (skillsUpsertError) {
      throw new Error(`Skills upsert failed: ${skillsUpsertError.message}`)
    }

    const { data: skillRows, error: skillsSelectError } = await supabase
      .from('skills')
      .select('id,slug')
      .in('slug', requiredSkills)
    if (skillsSelectError) {
      throw new Error(`Skills lookup failed: ${skillsSelectError.message}`)
    }

    if (skillRows?.length) {
      const { error: prsInsertError } = await supabase.from('project_required_skills').insert(
        skillRows.map((skill) => ({
          project_id: project.id,
          skill_id: skill.id,
        }))
      )
      if (prsInsertError) {
        throw new Error(`Project skills link failed: ${prsInsertError.message}`)
      }
    }
  }

  const { error: offersError } = await supabase.rpc('create_project_offers', {
    p_project_id: project.id,
    p_sender_id: user.id,
    p_message: null,
  })
  if (offersError) {
    throw new Error(`Offer fanout failed: ${offersError.message}`)
  }

  revalidatePath('/feed')
  revalidatePath('/notifications')
}
