export type SkillCategory = 'engineering' | 'design' | 'business'

export type Profile = {
  id: string
  full_name: string | null
  bio: string | null
  university: string | null
  skills: string[]
}

export type Project = {
  id: string
  creator_id: string
  title: string
  description: string
  required_skills: string[]
  team_size: number
  timeline: string
  category: SkillCategory
  status: 'open' | 'closed'
}
