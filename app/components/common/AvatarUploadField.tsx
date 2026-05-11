'use client'

import { useState } from 'react'
import AvatarUpload from './AvatarUpload'

export default function AvatarUploadField({
  defaultUrl,
  name,
}: {
  defaultUrl?: string | null
  name: string
}) {
  const [avatarUrl, setAvatarUrl] = useState(defaultUrl || '')

  return (
    <div>
      <AvatarUpload
        url={avatarUrl}
        name=""
        onUploadComplete={(url) => setAvatarUrl(url)}
      />
      <input type="hidden" name={name} value={avatarUrl} />
    </div>
  )
}
