export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          bio: string | null
          university: string | null
          skills: string[] | null
          created_at: string
        }
      }
      projects: {
        Row: {
          id: string
          creator_id: string
          title: string
          description: string
          required_skills: string[] | null
          team_size: number
          timeline: string
          category: string
          status: string
          created_at: string
        }
      }
    }
  }
}
