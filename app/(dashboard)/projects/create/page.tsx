import { createProject } from './actions'

export default function CreateProject() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h2 className="text-3xl font-semibold mb-8">Create a project</h2>
      <form action={createProject} className="space-y-6 card p-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Project title</label>
          <input name="title" className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="e.g. AI Study Buddy" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Description</label>
          <textarea name="description" className="w-full bg-white border rounded-xl p-3 outline-none h-32 focus:ring-2 focus:ring-indigo-400" placeholder="Describe the project scope..." required />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Required skills (comma separated)</label>
          <input name="skills" className="w-full bg-white border rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-400" placeholder="React, Python, Figma" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select name="category" className="w-full bg-white border rounded-xl p-3 outline-none">
              <option value="engineering">Engineering</option>
              <option value="design">Design</option>
              <option value="business">Business</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Timeline</label>
            <select name="timeline" className="w-full bg-white border rounded-xl p-3 outline-none">
              <option value="2-4 weeks">2-4 weeks</option>
              <option value="1-2 months">1-2 months</option>
              <option value="3+ months">3+ months</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Team size</label>
            <input type="number" min={2} max={12} defaultValue={4} name="team_size" className="w-full bg-white border rounded-xl p-3 outline-none" />
          </div>
        </div>
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all">
          Publish project
        </button>
      </form>
    </div>
  )
}