'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

type ProjectCardData = {
  id: string
  title: string
  description: string
  required_skills?: string[]
  profiles?: { full_name?: string | null } | null
}

export default function ProjectCard({ project, index }: { project: ProjectCardData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="card p-6 hover:-translate-y-0.5 transition-all group"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
          <span className="px-3 py-1 bg-slate-100 border rounded-full text-xs font-medium text-slate-600">
             @{project.profiles?.full_name || 'Anonymous'}
          </span>
          <h3 className="text-2xl font-semibold mt-2 group-hover:text-indigo-600 transition-colors">
            {project.title}
          </h3>
        </div>
        <Link href={`/projects/${project.id}`} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-all">View</Link>
      </div>
      <p className="text-slate-600 mb-6">{project.description}</p>
      <div className="flex flex-wrap gap-2 mb-8">
        {project.required_skills?.map((skill: string) => (
          <span key={skill} className="px-3 py-1.5 bg-indigo-50 border rounded-xl text-xs font-medium text-indigo-700">
            {skill}
          </span>
        ))}
      </div>
    </motion.div>
  )
}