'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { useJoinProject } from './useJoinProject'

type ProjectCardData = {
  id: string
  title: string
  description: string
  required_skills?: string[]
  creator_id?: string
  profiles?: { full_name?: string | null; avatar_url?: string | null } | null
}

function normalizeSkill(s: string) {
  return s.trim().toLowerCase()
}

export default function ProjectCard({
  project,
  index,
  userSkills,
  currentUserId,
}: {
  project: ProjectCardData
  index: number
  userSkills?: string[]
  currentUserId?: string | null
}) {
  const { requestJoin, pending } = useJoinProject()
  const matchCount =
    userSkills && userSkills.length > 0
      ? project.required_skills?.filter((rs) =>
          userSkills.some((us) => normalizeSkill(us) === normalizeSkill(rs))
        ).length ?? 0
      : 0

  const isPerfectMatch =
    matchCount > 0 && project.required_skills && project.required_skills.length > 0

  const isOwnProject = currentUserId && project.creator_id === currentUserId

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`card p-6 hover:-translate-y-0.5 transition-all group relative ${isPerfectMatch ? 'skill-match-glow' : ''}`}
    >
      {isPerfectMatch && (
        <div className="absolute -top-3 -right-3 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-lg">
          <Sparkles size={12} />
          {matchCount === project.required_skills?.length ? 'Perfect Match' : `+${matchCount} Match${matchCount > 1 ? 'es' : ''}`}
        </div>
      )}
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="px-3 py-1 bg-slate-100 border rounded-full text-xs font-medium text-slate-600">
             @{project.profiles?.full_name || 'Anonymous'}
          </span>
          <h3 className="text-2xl font-semibold mt-2 group-hover:text-indigo-600 transition-colors">
            {project.title}
          </h3>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${project.id}`} className="px-4 py-2 border text-sm font-medium rounded-xl hover:bg-slate-50 transition-all">View</Link>
          {!isOwnProject && currentUserId && project.creator_id ? (
            <button
              onClick={() => requestJoin(project.id, project.creator_id!)}
              disabled={pending}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-60"
            >
              {pending ? '...' : 'Join'}
            </button>
          ) : null}
        </div>
      </div>
      <p className="text-slate-600 mb-6">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {project.required_skills?.map((skill: string) => {
          const matched = userSkills?.some(
            (us) => normalizeSkill(us) === normalizeSkill(skill)
          )
          return (
            <span
              key={skill}
              className={`px-3 py-1.5 border rounded-xl text-xs font-medium transition-all ${matched ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-indigo-300 text-indigo-800' : 'bg-indigo-50 text-indigo-700'}`}
            >
              {skill}
            </span>
          )
        })}
      </div>
    </motion.div>
  )
}
