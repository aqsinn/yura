export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          university: string | null
          headline: string | null
          skills: string[]
          portfolio_links: string[]
          tier: 'free' | 'starter' | 'pro'
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          status: string
          price_id: string | null
          stripe_subscription_id: string | null
          current_period_end: string
          created: string
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
