'use client'

import { useActionState, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TagInput from '@/app/components/common/TagInput'
import { createProjectAction } from './actions'

type FormState = { error?: string; success?: boolean }

const initialState: FormState = {}

export default function CreateProjectForm({ initialError }: { initialError?: string }) {
  const [state, formAction, pending] = useActionState(createProjectAction, initialState)
  const router = useRouter()

  // Persist basic values in local state so they survive action failures.
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'engineering' | 'design' | 'business'>('engineering')
  const [timeline, setTimeline] = useState<'2-4 weeks' | '1-2 months' | '3+ months'>('2-4 weeks')
  const [teamSize, setTeamSize] = useState(4)

  // If we have a query-string error (old deployments), show it too.
  const error = state.error || initialError

  useEffect(() => {
    if (state.success) {
      router.push('/my-projects?created=1')
      router.refresh()
    }
  }, [router, state.success])

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-semibold mb-8">Create a project</h2>
      {error ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 p-4">
          <div className="font-semibold">Project creation failed</div>
          <div className="text-sm mt-1 break-words">{error}</div>
        </div>
      ) : null}

      <form action={formAction} className="space-y-6 card p-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Project title</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="e.g. AI Study Buddy"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-white border rounded-xl p-3 outline-none h-32 focus:ring-2 focus:ring-indigo-400"
            placeholder="Describe the project scope..."
            required
          />
        </div>

        <TagInput name="skills" label="Required skills" placeholder="React Python Figma" required />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value as 'engineering' | 'design' | 'business')}
              className="w-full bg-white border rounded-xl p-3 outline-none"
            >
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Timeline</label>
            <select
              name="timeline"
              value={timeline}
              onChange={(e) => setTimeline(e.target.value as '2-4 weeks' | '1-2 months' | '3+ months')}
              className="w-full bg-white border rounded-xl p-3 outline-none"
            >
              <option value="2-4 weeks">2-4 weeks</option>
              <option value="1-2 months">1-2 months</option>
              <option value="3+ months">3+ months</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Team size</label>
            <input
              type="number"
              min={2}
              max={12}
              name="team_size"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
              className="w-full bg-white border rounded-xl p-3 outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-60"
          disabled={pending}
        >
          {pending ? 'Publishing…' : 'Publish project'}
        </button>
      </form>
    </div>
  )
}

