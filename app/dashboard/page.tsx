"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, PlusSquare, Bell, User, 
  Flame, Clock, Filter, Paperclip,
  Rocket, Zap, ChevronRight, Target, Share2, Users2, 
  CheckCircle, ShieldCheck, Menu, X
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
    description: "Building a computer vision model to identify plant pests via live camera feed. Need a specialist in TensorFlow and React Native.",
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
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => setIsLoaded(true), []);

  const suggestedProjects = projects.filter(p => 
    p.skills.some(skill => userSkills.includes(skill))
  );

  if (!isLoaded) return null;

  return (
    <main className="flex min-h-screen bg-[#050505] text-white font-sans selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* --- Desktop Sidebar --- */}
      <nav className={`hidden lg:flex w-72 border-r border-white/5 flex-col p-8 fixed h-full bg-[#080808]/50 backdrop-blur-xl z-50`}>
        <div className="flex items-center gap-3 mb-12 group cursor-pointer">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
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

        <UserBadge />
      </nav>

      {/* --- Mobile Top Header --- */}
      <div className="lg:hidden fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
            <Rocket size={20} className="text-purple-500" />
            <span className="text-xl font-black tracking-tighter uppercase italic">Yura</span>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 bg-white/5 rounded-lg">
            {isSidebarOpen ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {/* --- Mobile Bottom Nav --- */}
      <nav className="lg:hidden fixed bottom-0 w-full z-50 bg-[#080808] border-t border-white/5 px-6 py-4 flex justify-between items-center backdrop-blur-xl">
          <MobileTab icon={<LayoutGrid size={20}/>} active={activeTab === 'Feed'} onClick={() => setActiveTab('Feed')} />
          <MobileTab icon={<PlusSquare size={20}/>} active={activeTab === 'Create'} onClick={() => setActiveTab('Create')} />
          <MobileTab icon={<Bell size={20}/>} active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
          <MobileTab icon={<User size={20}/>} active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
      </nav>

      {/* --- Main Content --- */}
      <section className="lg:ml-72 flex-1 pt-24 lg:pt-0 overflow-y-auto relative pb-32 lg:pb-0">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 py-8 lg:py-16">
          
          <header className="mb-8 lg:mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tighter mb-2 uppercase italic leading-none">
                {activeTab === 'Feed' && "The Feed"}
                {activeTab === 'Create' && "Launch Vision"}
                {activeTab === 'Notifications' && "Signals"}
                {activeTab === 'Profile' && "Bio-Data"}
              </h2>
              <p className="text-gray-500 font-bold text-sm lg:text-lg uppercase tracking-tight">
                {activeTab === 'Feed' && "The network is live."}
                {activeTab === 'Create' && "Deploy to the global feed."}
              </p>
            </motion.div>
            
            {activeTab === 'Feed' && (
              <div className="flex gap-2">
                <FilterButton icon={<Flame size={14} className="text-orange-500"/>} label="Trending" />
                <FilterButton icon={<Clock size={14} className="text-blue-500"/>} label="Latest" />
              </div>
            )}
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'Feed' && (
                <div className="space-y-6">
                  {/* Neural Alert */}
                  <motion.div className="p-6 lg:p-8 bg-purple-600/10 border border-purple-500/20 rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                         <Target size={16} className="text-purple-400" />
                         <p className="text-purple-300 font-black text-[10px] tracking-widest uppercase">Neural Match</p>
                      </div>
                      <p className="text-xl font-black italic uppercase">Found {suggestedProjects.length} Affinity Matches.</p>
                    </div>
                    <button className="relative z-10 px-6 py-3 bg-purple-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-transform w-full sm:w-auto">
                      Sync Now
                    </button>
                  </motion.div>

                  <div className="grid grid-cols-1 gap-4 lg:gap-6">
                    {projects.map((project, i) => (
                      <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Create' && <CreateProjectForm onCreated={() => setActiveTab('Feed')} />}
              {activeTab === 'Profile' && <ProfileView skills={userSkills} />}
              {activeTab === 'Notifications' && (
                <div className="space-y-3 max-w-2xl">
                  <NotificationItem text="Julian_Designer joined 'Yura Redesign'" time="2m ago" type="join" />
                  <NotificationItem text="Skill 'React' was peer-verified" time="1h ago" type="verify" />
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
    <button onClick={onClick} className={`relative w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group ${active ? 'bg-white text-black font-black' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
      <span className="relative z-10">{icon}</span>
      <span className="relative z-10 uppercase text-[10px] font-black tracking-widest">{label}</span>
      {!active && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
    </button>
  );
}

function MobileTab({ icon, active, onClick }: any) {
    return (
        <button onClick={onClick} className={`p-3 rounded-xl transition-all ${active ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-gray-500'}`}>
            {icon}
        </button>
    );
}

function ProjectCard({ project, index }: { project: Project, index: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className="p-6 lg:p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] lg:rounded-[3rem] hover:border-purple-500/30 transition-all group"
    >
      <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
             <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-black text-gray-500 tracking-widest uppercase">@{project.creator}</span>
             {project.status === 'trending' && <span className="flex items-center gap-1 text-[9px] font-black text-orange-500 tracking-widest uppercase italic"><Flame size={12}/> Trending</span>}
          </div>
          <h3 className="text-2xl lg:text-3xl font-black group-hover:text-purple-400 transition-colors uppercase italic tracking-tighter leading-none">{project.title}</h3>
        </div>
        <button className="w-full lg:w-auto px-8 py-4 bg-white text-black text-[10px] font-black tracking-widest uppercase rounded-2xl hover:bg-purple-500 hover:text-white transition-all active:scale-95">
          Join Squad
        </button>
      </div>
      
      <p className="text-gray-400 mb-6 leading-relaxed font-medium text-sm lg:text-lg max-w-3xl">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-8">
        {project.skills.map(skill => (
          <span key={skill} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black tracking-widest text-gray-500 uppercase">
            {skill}
          </span>
        ))}
      </div>

      <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[9px] font-black tracking-widest text-gray-600 uppercase">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2"><Paperclip size={14} /> 2 Assets</span>
          <span className="flex items-center gap-2"><Users2 size={14} /> {project.interested.length} INTERESTED</span>
        </div>
        <div className="group-hover:text-purple-500 cursor-pointer">Manifesto →</div>
      </div>
    </motion.div>
  );
}

function FilterButton({ icon, label }: any) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10 text-[9px] font-black tracking-widest uppercase hover:bg-white/10 transition-all">
      {icon} {label}
    </button>
  );
}

function CreateProjectForm({ onCreated }: any) {
  return (
    <div className="bg-white/[0.02] border border-white/5 p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[4rem] max-w-3xl mx-auto space-y-8">
      <div className="space-y-3">
        <label className="text-[10px] font-black tracking-[0.3em] text-gray-600 uppercase ml-2">Manifesto Title</label>
        <input className="w-full bg-white/5 border border-white/10 rounded-2xl lg:rounded-[2rem] p-5 lg:p-7 text-lg font-bold focus:border-purple-500 outline-none transition placeholder:text-gray-800 uppercase italic" placeholder="e.g. COFFEE TRACKER" />
      </div>
      <button onClick={onCreated} className="w-full py-6 lg:py-8 bg-white text-black font-black text-lg lg:text-xl rounded-2xl lg:rounded-[2rem] hover:bg-purple-500 hover:text-white transition-all uppercase tracking-tighter italic shadow-xl">
        Deploy Manifesto
      </button>
    </div>
  );
}

function ProfileView({ skills }: { skills: string[] }) {
  return (
    <div className="space-y-8 lg:space-y-12">
      <div className="flex flex-col md:flex-row items-center gap-8 p-8 lg:p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] lg:rounded-[3.5rem] text-center md:text-left">
        <div className="w-24 h-24 lg:w-32 lg:h-32 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-[2rem] lg:rounded-[2.5rem] flex items-center justify-center text-4xl lg:text-5xl shadow-2xl">
          👨‍💻
        </div>
        <div className="flex-1">
          <h3 className="text-3xl lg:text-5xl font-black tracking-tighter italic uppercase mb-1">Dev_Dudeman</h3>
          <p className="text-gray-500 font-bold text-sm lg:text-lg uppercase">Full Stack Engineer • <span className="text-white">12 Projects</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <div className="p-8 lg:p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] lg:rounded-[3rem]">
            <h4 className="font-black text-[10px] tracking-widest uppercase text-gray-600 mb-6 flex items-center gap-2"><ShieldCheck size={16} className="text-green-500"/> Verified Stack</h4>
            <div className="flex flex-wrap gap-2">
                {skills.map(s => <span key={s} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase text-gray-400">{s}</span>)}
            </div>
        </div>
        <div className="p-8 lg:p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] lg:rounded-[3rem]">
            <h4 className="font-black text-[10px] tracking-widest uppercase text-gray-600 mb-2 italic">Reputation</h4>
            <div className="text-5xl font-black italic bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">LVL 14</div>
        </div>
      </div>
    </div>
  );
}

function UserBadge() {
    return (
        <motion.div whileHover={{ scale: 1.02 }} className="p-5 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem] border border-white/10 backdrop-blur-sm mt-auto">
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-400" />
             <div className="overflow-hidden">
                <p className="text-[9px] font-black text-gray-500 tracking-widest uppercase leading-none mb-1">Operator</p>
                <p className="text-sm font-bold truncate">Dev_Dudeman</p>
             </div>
          </div>
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-purple-500" />
          </div>
        </motion.div>
    );
}

function NotificationItem({ text, time, type }: { text: string, time: string, type: 'join' | 'verify' | 'alert' }) {
    return (
      <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white/[0.05] transition-all">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
              {type === 'join' ? <Users2 size={16}/> : <CheckCircle size={16}/>}
          </div>
          <p className="font-bold text-gray-400 group-hover:text-white transition-colors uppercase text-[11px] tracking-tight">{text}</p>
        </div>
        <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest">{time}</span>
      </div>
    );
}