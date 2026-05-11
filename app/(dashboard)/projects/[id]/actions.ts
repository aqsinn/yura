'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function requestToJoinProject(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const projectId = String(formData.get('project_id') || '')
  if (!projectId) return

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('creator_id')
    .eq('id', projectId)
    .single()

  if (projectError || !project?.creator_id) {
    redirect(
      `/projects/${projectId}?error=${encodeURIComponent(
        projectError?.message || 'Project not found.'
      )}`
    )
  }

  const ownerId = project.creator_id as string

  if (user.id === ownerId) {
    redirect(`/projects/${projectId}?error=${encodeURIComponent('You are the project owner.')}`)
  }

  const { error } = await supabase.from('offers').upsert(
    {
      project_id: projectId,
      sender_id: user.id,
      receiver_id: ownerId,
      status: 'pending',
      message: 'I would like to join this project.',
    },
    { onConflict: 'project_id,sender_id,receiver_id' }
  )

  if (error) {
    redirect(`/projects/${projectId}?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/my-projects')
  revalidatePath(`/projects/${projectId}`)
  redirect(`/projects/${projectId}?requested=1`)
}
