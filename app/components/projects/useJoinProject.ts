'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export function useJoinProject() {
  const [pending, setPending] = useState(false)
  const router = useRouter()

  const requestJoin = async (projectId: string) => {
    setPending(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('creator_id')
        .eq('id', projectId)
        .single()

      if (projectError || !project?.creator_id) {
        console.error('Join request failed: could not load project owner')
        return
      }

      const receiverId = project.creator_id as string
      if (receiverId === user.id) {
        router.push(
          `/projects/${projectId}?error=${encodeURIComponent('You are the project owner.')}`
        )
        return
      }

      const { error } = await supabase.from('offers').upsert(
        {
          project_id: projectId,
          sender_id: user.id,
          receiver_id: receiverId,
          status: 'pending',
        },
        { onConflict: 'project_id,sender_id,receiver_id' }
      )

      if (!error) {
        router.push(`/projects/${projectId}?requested=1`)
      } else {
        console.error('Join request failed:', error.message)
      }
    } finally {
      setPending(false)
    }
  }

  return { requestJoin, pending }
}
