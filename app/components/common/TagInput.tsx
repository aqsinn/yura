'use client'

import { useMemo, useState } from 'react'

type TagInputProps = {
  name: string
  defaultValue?: string[]
  placeholder?: string
  label?: string
  required?: boolean
}

function normalizeTag(raw: string) {
  return raw.trim().toLowerCase().replace(/\s+/g, ' ')
}

export default function TagInput({ name, defaultValue, placeholder, label, required }: TagInputProps) {
  const [value, setValue] = useState('')
  const [tags, setTags] = useState<string[]>(() => (defaultValue || []).map(normalizeTag).filter(Boolean))

  const serialized = useMemo(() => tags.join(', '), [tags])

  const addTag = (raw: string) => {
    const t = normalizeTag(raw)
    if (!t) return
    setTags((prev) => (prev.includes(t) ? prev : [...prev, t]))
  }

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === ',') {
      e.preventDefault()
      addTag(value)
      setValue('')
      return
    }

    if (e.key === 'Backspace' && !value && tags.length) {
      e.preventDefault()
      setTags((prev) => prev.slice(0, -1))
    }
  }

  const onBlur: React.FocusEventHandler<HTMLInputElement> = () => {
    if (value.trim()) {
      addTag(value)
      setValue('')
    }
  }

  return (
    <div className="space-y-2">
      {label ? <label className="text-sm font-medium text-slate-700">{label}</label> : null}
      <input type="hidden" name={name} value={serialized} required={required} />
      <div className="flex flex-wrap gap-2 rounded-xl border bg-white p-2 focus-within:ring-2 focus-within:ring-indigo-400 transition-all">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 text-indigo-700 px-3 py-1 text-sm">
            {t}
            <button
              type="button"
              className="text-indigo-700/70 hover:text-indigo-900"
              aria-label={`Remove ${t}`}
              onClick={() => setTags((prev) => prev.filter((x) => x !== t))}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
          className="flex-1 min-w-[12ch] p-2 outline-none text-sm"
          placeholder={placeholder}
        />
      </div>
      <p className="text-xs text-slate-500">Press space or enter to add. Click × to remove.</p>
    </div>
  )
}

