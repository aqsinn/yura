'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Avatar from './Avatar'
import { Camera } from 'lucide-react'

export default function AvatarUpload({
  url,
  name,
  onUploadComplete,
}: {
  url?: string | null
  name?: string | null
  onUploadComplete: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return

    const previewUrl = URL.createObjectURL(file)
    setPreview(previewUrl)
    setUploading(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const ext = file.name.split('.').pop()
      const path = `${user.id}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true })

      if (uploadError) {
        console.error('Upload failed:', uploadError)
        return
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      onUploadComplete(data.publicUrl)
    } finally {
      setUploading(false)
      URL.revokeObjectURL(previewUrl)
      setPreview(null)
    }
  }

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative group cursor-pointer" onClick={() => inputRef.current?.click()}>
        <Avatar src={preview || url} name={name} size="xl" />
        <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Camera size={24} className="text-white" />
        </div>
        {uploading && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">Profile photo</p>
        <p className="text-xs text-slate-500">Click to upload (JPEG, PNG, WebP, GIF)</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
