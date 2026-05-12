import { createClient } from '@/utils/supabase/server'
import ProjectCard from '@/app/components/projects/ProjectCard'
import MessagesWidget from '@/app/components/messaging/MessagesWidget'
import Link from 'next/link'
import { Sparkles, Crown, Flame, Zap } from 'lucide-react'

type UserTier = 'free' | 'starter' | 'pro' | 'premium' | 'sigma' | 'alpha';

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ skill?: string; category?: string; timeline?: string; created?: string; success?: string }>
}) {
  const { skill, category, timeline, created, success } = await searchParams
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  // Fetch projects and profile in parallel
  const [projectsRes, profileRes, requestsRes, membershipsRes] = await Promise.all([
    supabase
      .from('projects')
      .select('*, creator_id, profiles:creator_id(full_name, avatar_url)')
      .eq('status', 'open')
      .order('created_at', { ascending: false }),
    user ? supabase.from('profiles').select('skills, tier, full_name').eq('id', user.id).single() : Promise.resolve({ data: null }),
    user ? supabase.from('offers').select('project_id').eq('sender_id', user.id) : Promise.resolve({ data: [] }),
    user ? supabase.from('project_members').select('project_id').eq('profile_id', user.id) : Promise.resolve({ data: [] }),
  ])

  const projects = projectsRes.data
  const profile = profileRes.data
  const userTier = (profile?.tier?.toLowerCase() || 'free') as UserTier
  const isPaid = userTier !== 'free'
  
  const userSkills: string[] = (profile?.skills as string[] | null) ?? []
  const requestedProjectIds = new Set(requestsRes.data?.map((r) => r.project_id) || [])
  const joinedProjectIds = new Set(membershipsRes.data?.map((m) => m.project_id) || [])

  // COOLNESS DEFINITIONS FOR THE FEED
  const feedThemes: Record<UserTier, string> = {
    free: "",
    starter: "border-t-4 border-emerald-500",
    pro: "border-t-4 border-indigo-500",
    premium: "border-t-4 border-purple-500",
    sigma: "bg-slate-950/50 min-h-screen -m-8 p-8 border-t-4 border-fuchsia-600 shadow-[inset_0_0_50px_rgba(192,38,211,0.1)]",
    alpha: "bg-slate-950 min-h-screen -m-8 p-8 border-t-4 border-red-600 shadow-[inset_0_0_60px_rgba(239,68,68,0.15)]",
  }

  return (
    <div className={`transition-all duration-1000 ${feedThemes[userTier]}`}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Success Alert for newly upgraded users */}
        {success === 'true' && (
          <div className="flex items-center gap-3 rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 text-emerald-700 animate-in fade-in slide-in-from-top-4 duration-500">
            <Zap className="fill-emerald-500" />
            <p className="font-bold">Payment Successful! Your {userTier} benefits are now active.</p>
          </div>
        )}

        {created ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 p-4">Project published successfully.</div> : null}
        
        {/* DYNAMIC BANNER LOGIC */}
        {!isPaid ? (
          <Link 
            href="/pricing" 
            className="group relative block overflow-hidden rounded-3xl bg-indigo-600 p-8 text-white transition-all hover:bg-indigo-700 shadow-2xl shadow-indigo-200"
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div>
                  <h3 className="text-2xl font-black">Boost your profile with AlphaMaxed</h3>
                  <p className="text-indigo-100 text-lg">Get Specialized matching, featured badges, and unlimited project reach.</p>
                </div>
              </div>
              <span className="rounded-xl bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-indigo-600 transition-all group-hover:scale-105 group-hover:shadow-lg">
                Upgrade Now
              </span>
            </div>
            <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-all group-hover:scale-150" />
          </Link>
        ) : (
          /* PREMIUM WELCOME (Shows only if paid) */
          <div className="flex items-center justify-between p-6 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-800 text-white border border-white/10 shadow-xl">
             <div className="flex items-center gap-4">
                {userTier === 'sigma' || userTier === 'alpha' ? <Flame className="text-orange-500" size={32} /> : <Crown className="text-yellow-500" size={32} />}
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] opacity-50">Welcome back, {userTier}</p>
                  <h3 className="text-xl font-bold">Exclusive feed for {profile?.full_name}</h3>
                </div>
             </div>
             <div className="hidden md:block px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-xs font-medium">
               Priority Access Active
             </div>
          </div>
        )}

        <div className="flex justify-between items-end">
          <header>
            <h2 className={`text-4xl font-black tracking-tighter ${userTier === 'sigma' || userTier === 'alpha' ? 'text-white' : 'text-slate-900'}`}>
              {isPaid ? 'Prime Matches' : 'Recommended projects'}
            </h2>
            <p className={userTier === 'sigma' || userTier === 'alpha' ? 'text-slate-400' : 'text-slate-600'}>
              {isPaid ? "Hand-picked high-quality projects for your tier." : "Projects matched for your interests and skills."}
            </p>
          </header>
          <div className="mt-2">
            <MessagesWidget />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {projects?.length ? projects.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              userSkills={userSkills}
              currentUserId={user?.id}
              hasRequested={requestedProjectIds.has(project.id)}
              hasJoined={joinedProjectIds.has(project.id)}
            />
          )) : (
            <div className={`card p-12 text-center border-2 border-dashed ${userTier === 'sigma' || userTier === 'alpha' ? 'border-slate-800 text-slate-500' : 'text-slate-600'}`}>
               No matches found yet. Expand your skills to see more!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}