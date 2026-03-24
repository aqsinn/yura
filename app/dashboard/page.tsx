"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, PlusSquare, Bell, User, Search, 
  Send, CheckCircle, Flame, Clock, Filter, Paperclip,
  Rocket, Zap, ChevronRight, Target, Share2, Users2, // FIXED: Added Users2 to imports
  Terminal, Globe, Cpu, ShieldCheck
} from 'lucide-react';

// --- Types ---
type Project = {
  id: string;
  title: string;
  creator: string;
  description: string;
  skills: string[];
  interested: string[];
  selected: string[];
  timestamp: Date;
  status?: 'trending' | 'new' | 'matching';
};

// --- Mock Data ---
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: "AI-Powered Gardening App",
    creator: "Alex Rivers",
    description: "Building a computer vision model to identify plant pests via live camera feed. Need a specialist in TensorFlow and React Native to bridge the gap.",
    skills: ["Python", "TensorFlow", "React Native"],
    interested: ["Sarah_Dev", "Mike_Code"],
    selected: [],
    timestamp: new Date(),
    status: 'matching'
  },
  {
    id: '2',
    title: "Yura Platform Redesign",
    creator: "Admin",
    description: "We are refining the contributor selection flow. Seeking a UI/UX expert who understands high-density developer interfaces.",
    skills: ["Figma", "Tailwind CSS", "Next.js"],
    interested: ["Julian_Designer"],
    selected: ["Julian_Designer"],
    timestamp: new Date(),
    status: 'trending'
  }
];

export default function YuraApp() {
  const [activeTab, setActiveTab] = useState<'Feed' | 'Create' | 'Notifications' | 'Profile'>('Feed');
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [userSkills] = useState(["Next.js", "Tailwind CSS"]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => setIsLoaded(true), []);

  const suggestedProjects = projects.filter(p => 
    p.skills.some(skill => userSkills.includes(skill))
  );

  if (!isLoaded) return null;

  return (
    <main className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-hidden">
      
      {/* --- Sidebar Navigation --- */}
      <nav className="w-72 border-r border-white/5 flex flex-col p-8 fixed h-full bg-[#080808]/50 backdrop-blur-xl z-50">
        <div className="flex items-center gap-3 mb-12 group cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <Rocket size={20} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Yura</span>
        </div>
        
        <div className="space-y-3 flex-1">
          <NavItem icon={<LayoutGrid size={20}/>} label="Feed" active={activeTab === 'Feed'} onClick={() => setActiveTab('Feed')} />
          <NavItem icon={<PlusSquare size={20}/>} label="Create" active={activeTab === 'Create'} onClick={() => setActiveTab('Create')} />
          <NavItem icon={<Bell size={20}/>} label="Inbox" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
          <NavItem icon={<User size={20}/>} label="Identity" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
        </div>

        {/* User Card */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="p-5 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] border border-white/10 backdrop-blur-sm mt-auto"
        >
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-400" />
             <div>
                <p className="text-[10px] font-black text-gray-500 tracking-widest uppercase leading-none mb-1">Operator</p>
                <p className="text-sm font-bold leading-none">Dev_Dudeman</p>
             </div>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-purple-500" />
          </div>
        </motion.div>
      </nav>

      {/* --- Main Content Area --- */}
      <section className="ml-72 flex-1 overflow-y-auto relative custom-scrollbar">
        {/* Background Gradients */}
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-purple-600/5 blur-[140px] pointer-events-none" />
        <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto px-12 py-16">
          
          <header className="mb-12 flex justify-between items-end">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-5xl font-black tracking-tighter mb-2 uppercase italic">
                {activeTab === 'Feed' && "The Feed"}
                {activeTab === 'Create' && "Launch Vision"}
                {activeTab === 'Notifications' && "Signal Center"}
                {activeTab === 'Profile' && "Bio-Data"}
              </h2>
              <p className="text-gray-500 font-medium text-lg">
                {activeTab === 'Feed' && "The network is live. Find your squad."}
                {activeTab === 'Create' && "Deploy your next big project to the feed."}
              </p>
            </motion.div>
            
            {activeTab === 'Feed' && (
              <div className="flex gap-3">
                <FilterButton icon={<Flame size={16} className="text-orange-500"/>} label="Trending" />
                <FilterButton icon={<Clock size={16} className="text-blue-500"/>} label="Latest" />
              </div>
            )}
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {activeTab === 'Feed' && (
                <div className="space-y-8">
                  {/* Neural Match Alert */}
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className="p-8 bg-purple-600/10 border border-purple-500/20 rounded-[2.5rem] flex items-center justify-between group overflow-hidden relative shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                        <Zap size={100} className="text-purple-500" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-2">
                         <Target size={18} className="text-purple-400" />
                         <p className="text-purple-300 font-black text-xs tracking-widest uppercase">Neural Match</p>
                      </div>
                      <p className="text-2xl font-bold">Found {suggestedProjects.length} high-affinity projects.</p>
                      <p className="text-purple-200/50 mt-1 font-medium italic">Optimized for your Next.js expertise.</p>
                    </div>
                    <button className="relative z-10 px-6 py-3 bg-purple-500 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-500/20 hover:brightness-110 transition active:scale-95">
                      Sync Now
                    </button>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-6 pb-20">
                    {projects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Create' && <CreateProjectForm onCreated={() => setActiveTab('Feed')} />}
              
              {activeTab === 'Profile' && <ProfileView skills={userSkills} />}

              {activeTab === 'Notifications' && (
                <div className="space-y-4 max-w-2xl">
                  <NotificationItem text="Julian_Designer applied to 'Yura Redesign'" time="2m ago" type="join" />
                  <NotificationItem text="Your skill 'React' was peer-verified" time="1h ago" type="verify" />
                  <NotificationItem text="Project 'AI-Garden' is now trending" time="4h ago" type="alert" />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

// --- Internal Components ---

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group overflow-hidden ${
        active ? 'bg-white text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'
      }`}
    >
      {active && <motion.div layoutId="nav-bg" className="absolute inset-0 bg-white" />}
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 uppercase text-[10px] font-black tracking-[0.2em]">{label}</span>
      {!active && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
    </button>
  );
}

function ProjectCard({ project, index }: { project: Project, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] hover:bg-white/[0.04] hover:border-purple-500/30 transition-all duration-500 group relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
             <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-gray-500 tracking-widest uppercase">@{project.creator}</span>
             {project.status === 'trending' && <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 tracking-widest uppercase"><Flame size={12}/> Trending</span>}
          </div>
          <h3 className="text-3xl font-black group-hover:text-purple-400 transition-colors uppercase italic tracking-tighter leading-none">{project.title}</h3>
        </div>
        <button className="px-8 py-4 bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-2xl hover:bg-purple-500 hover:text-white transition-all shadow-xl active:scale-95">
          Join Squad
        </button>
      </div>
      
      <p className="text-gray-400 mb-8 leading-relaxed font-medium text-lg max-w-3xl relative z-10">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-10 relative z-10">
        {project.skills.map(skill => (
          <span key={skill} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest text-gray-400 group-hover:text-white transition-colors uppercase">
            {skill}
          </span>
        ))}
      </div>

      <div className="pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-gray-600 uppercase relative z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Paperclip size={14} /> 2 Assets
          </div>
          <div className="flex items-center gap-2">
            <Users2 size={14} /> {project.interested.length} Interested
          </div>
        </div>
        <div className="group-hover:text-purple-500 transition-colors cursor-pointer">Manifesto →</div>
      </div>
    </motion.div>
  );
}

function FilterButton({ icon, label }: any) {
  return (
    <button className="flex items-center gap-2 px-6 py-3 bg-white/5 rounded-2xl border border-white/10 text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition-all active:scale-95">
      {icon} {label}
    </button>
  );
}

function CreateProjectForm({ onCreated }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-12 rounded-[4rem] max-w-3xl mx-auto space-y-10 shadow-2xl">
      <div className="space-y-4">
        <label className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase ml-2">Manifesto Title</label>
        <input className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-7 text-xl font-bold focus:border-purple-500 outline-none transition placeholder:text-gray-800" placeholder="e.g. DECENTRALIZED COFFEE TRACKER" />
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase ml-2">Stack Requirements</label>
        <div className="flex flex-wrap gap-3 p-6 bg-white/5 border border-white/10 rounded-[2rem]">
          {["React", "Solidity", "Tailwind", "Node.js", "Python", "Rust"].map(s => (
            <button key={s} className="px-5 py-2 bg-purple-500/10 text-purple-400 rounded-xl text-[10px] font-black border border-purple-500/20 hover:bg-purple-500 hover:text-white transition-all uppercase tracking-widest">+{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase ml-2">Mission Briefing</label>
        <textarea rows={5} className="w-full bg-white/5 border border-white/10 rounded-[2rem] p-7 text-lg font-medium focus:border-purple-500 outline-none transition placeholder:text-gray-800" placeholder="Break down the vision..." />
      </div>

      <button onClick={onCreated} className="w-full py-8 bg-white text-black font-black text-xl rounded-[2rem] hover:bg-purple-500 hover:text-white transition-all shadow-2xl shadow-purple-500/10 uppercase tracking-tighter italic">
        Deploy to Global Feed
      </button>
    </div>
  );
}

function ProfileView({ skills }: { skills: string[] }) {
  return (
    <div className="space-y-12">
      <div className="flex items-center gap-10 p-10 bg-white/[0.02] border border-white/5 rounded-[3.5rem] shadow-xl">
        <div className="w-32 h-32 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-[2.5rem] flex items-center justify-center text-5xl shadow-2xl">
          👨‍💻
        </div>
        <div>
          <h3 className="text-5xl font-black tracking-tighter italic uppercase mb-2">Dev_Dudeman</h3>
          <p className="text-gray-500 font-bold text-lg uppercase tracking-tight">Full Stack Engineer • <span className="text-white">12 Projects Joined</span></p>
          <div className="flex gap-4 mt-6">
             <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition">Edit Profile</button>
             <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-white/10 transition flex items-center gap-2"><Share2 size={12}/> Share Identity</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <StatsCard icon={<ShieldCheck size={18} className="text-green-500"/>} title="Verified Stack">
          <div className="flex flex-wrap gap-3 mt-4">
            {skills.map(s => <span key={s} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-300">{s}</span>)}
            <button className="px-5 py-3 border border-dashed border-white/20 rounded-2xl text-[10px] font-black text-gray-600 hover:border-white/40 transition-colors uppercase tracking-widest">+ Add</button>
          </div>
        </StatsCard>
        
        <div className="p-10 bg-white/[0.02] rounded-[3rem] border border-white/5 flex flex-col justify-between shadow-xl">
          <div>
             <h4 className="font-black text-[10px] tracking-[0.3em] mb-2 uppercase text-gray-600">Reputation Tier</h4>
             <div className="text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">LVL 14</div>
          </div>
          <div className="mt-8">
             <div className="flex justify-between text-[10px] font-black tracking-widest text-gray-600 uppercase mb-2">
                <span>1,240 XP</span>
                <span>Next: 1,500 XP</span>
             </div>
             <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '82%' }} className="h-full bg-gradient-to-r from-purple-500 to-blue-500" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ text, time, type }: { text: string, time: string, type: 'join' | 'verify' | 'alert' }) {
  return (
    <motion.div 
      whileHover={{ x: 10 }}
      className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex justify-between items-center group cursor-pointer hover:bg-white/[0.05]"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            type === 'join' ? 'bg-blue-500/20 text-blue-400' : 
            type === 'verify' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
        }`}>
            {type === 'join' && <Users2 size={18} />}
            {type === 'verify' && <CheckCircle size={18} />}
            {type === 'alert' && <Bell size={18} />}
        </div>
        <p className="font-bold text-gray-400 group-hover:text-white transition-colors uppercase text-sm tracking-tight">{text}</p>
      </div>
      <span className="text-[10px] font-black tracking-widest text-gray-700 uppercase">{time}</span>
    </motion.div>
  );
}

function StatsCard({ icon, title, children }: any) {
    return (
        <div className="p-10 bg-white/[0.02] rounded-[3rem] border border-white/5 shadow-xl">
          <h4 className="font-black text-[10px] tracking-[0.3em] mb-6 flex items-center gap-3 uppercase text-gray-600">
            {icon} {title}
          </h4>
          {children}
        </div>
    )
}