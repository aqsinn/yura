"use client";

import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, PlusSquare, Bell, User, Search, 
  Send, CheckCircle, Flame, Clock, Filter, Paperclip 
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
};

// --- Mock Data ---
const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    title: "AI-Powered Gardening App",
    creator: "Alex Rivers",
    description: "Looking for someone to help with the computer vision model to identify pests via camera feed.",
    skills: ["Python", "TensorFlow", "React Native"],
    interested: ["Sarah_Dev", "Mike_Code"],
    selected: [],
    timestamp: new Date()
  },
  {
    id: '2',
    title: "Yura Platform Redesign",
    creator: "Admin",
    description: "We need a UI/UX expert to refine the contributor selection flow.",
    skills: ["Figma", "Tailwind CSS", "Next.js"],
    interested: ["Julian_Designer"],
    selected: ["Julian_Designer"],
    timestamp: new Date()
  }
];

export default function YuraApp() {
  const [activeTab, setActiveTab] = useState<'Feed' | 'Create' | 'Notifications' | 'Profile'>('Feed');
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [userSkills] = useState(["Next.js", "Tailwind CSS"]); // Mock logged-in user skills
  const [searchQuery, setSearchQuery] = useState("");

  // Filter projects based on "Skill Matching"
  const suggestedProjects = projects.filter(p => 
    p.skills.some(skill => userSkills.includes(skill))
  );

  return (
    <main className="flex min-h-screen bg-[#0A0A0A] text-gray-100 font-sans selection:bg-purple-500/30">
      
      {/* --- Sidebar Navigation --- */}
      <nav className="w-64 border-r border-white/10 flex flex-col p-6 fixed h-full bg-[#0A0A0A]">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent mb-10">
          Yura
        </h1>
        
        <div className="space-y-2 flex-1">
          <NavItem icon={<LayoutGrid size={20}/>} label="Menu" active={activeTab === 'Feed'} onClick={() => setActiveTab('Feed')} />
          <NavItem icon={<PlusSquare size={20}/>} label="Create" active={activeTab === 'Create'} onClick={() => setActiveTab('Create')} />
          <NavItem icon={<Bell size={20}/>} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
          <NavItem icon={<User size={20}/>} label="Profile" active={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
        </div>

        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
          <p className="text-xs text-gray-500 mb-2">Logged in as</p>
          <p className="text-sm font-medium">Dev_Dudeman</p>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <section className="ml-64 flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Header / Hero Context */}
          <header className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                {activeTab === 'Feed' && "Project Feed"}
                {activeTab === 'Create' && "Launch a Project"}
                {activeTab === 'Notifications' && "Inbox"}
                {activeTab === 'Profile' && "Your Identity"}
              </h2>
              <p className="text-gray-400">
                {activeTab === 'Feed' && "Find projects that match your stack."}
              </p>
            </div>
            
            {activeTab === 'Feed' && (
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm hover:bg-white/10 transition">
                  <Flame size={16} className="text-orange-500"/> Trending
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm hover:bg-white/10 transition">
                  <Clock size={16} className="text-blue-500"/> Newest
                </button>
              </div>
            )}
          </header>

          {/* --- Tab Content Switcher --- */}
          {activeTab === 'Feed' && (
            <div className="space-y-6">
              {/* Skill Matching Alert */}
              <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-purple-300 font-medium">Matched for you</p>
                  <p className="text-sm text-purple-200/60">We found {suggestedProjects.length} projects seeking your skills.</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-[#0A0A0A] flex items-center justify-center text-xs">JS</div>
                  <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-[#0A0A0A] flex items-center justify-center text-xs">TS</div>
                </div>
              </div>

              {/* Infinite-style Scroll Feed */}
              <div className="space-y-4">
                {projects.map(project => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Create' && <CreateProjectForm onCreated={() => setActiveTab('Feed')} />}
          
          {activeTab === 'Profile' && <ProfileView skills={userSkills} />}

          {activeTab === 'Notifications' && (
            <div className="space-y-4">
              <NotificationItem text="Julian_Designer joined 'Yura Redesign'" time="2m ago" />
              <NotificationItem text="Your skill 'React' was verified by 3 peers" time="1h ago" />
            </div>
          )}

        </div>
      </section>
    </main>
  );
}

// --- Sub-Components ---

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
        active ? 'bg-white text-black font-semibold' : 'text-gray-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="p-6 bg-[#121212] border border-white/5 rounded-2xl hover:border-white/20 transition group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold group-hover:text-purple-400 transition">{project.title}</h3>
          <p className="text-sm text-gray-500">Posted by @{project.creator}</p>
        </div>
        <button className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition">
          Join Project
        </button>
      </div>
      
      <p className="text-gray-400 mb-6 leading-relaxed">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {project.skills.map(skill => (
          <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300">
            {skill}
          </span>
        ))}
      </div>

      <div className="pt-4 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Paperclip size={14} />
          <span>2 Attachments</span>
        </div>
        <div className="text-sm text-gray-500">
          {project.interested.length} People interested
        </div>
      </div>
    </div>
  );
}

function CreateProjectForm({ onCreated }: any) {
  return (
    <div className="bg-[#121212] border border-white/5 p-8 rounded-3xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Project Title</label>
        <input className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500 outline-none transition" placeholder="e.g. Decentralized Coffee Tracker" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Required Skills (Multi-select)</label>
        <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
          {["React", "Solidity", "Tailwind", "Node.js"].map(s => (
            <button key={s} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md text-sm border border-purple-500/30">+{s}</button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-400">Description</label>
        <textarea rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:border-purple-500 outline-none transition" placeholder="Tell the dudes what this is about..." />
      </div>

      <button onClick={onCreated} className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition">
        Post Project to Feed
      </button>
    </div>
  );
}

function ProfileView({ skills }: { skills: string[] }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-3xl flex items-center justify-center text-4xl">
          👨‍💻
        </div>
        <div>
          <h3 className="text-2xl font-bold">Dev_Dudeman</h3>
          <p className="text-gray-400">Full Stack Engineer • 12 Projects Joined</p>
          <button className="mt-2 text-sm text-purple-400 hover:underline">Edit Public Profile</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <CheckCircle size={18} className="text-green-500"/> Verified Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => <span key={s} className="px-3 py-1 bg-white/10 rounded-lg text-sm">{s}</span>)}
            <button className="px-3 py-1 border border-dashed border-white/20 rounded-lg text-sm text-gray-500">+ Add Skill</button>
          </div>
        </div>
        
        <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
          <h4 className="font-bold mb-4">Reputation</h4>
          <div className="text-3xl font-bold italic text-white/40">LEVEL 14</div>
          <p className="text-xs text-gray-500 mt-2">Next level at 1,500 XP</p>
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ text, time }: { text: string, time: string }) {
  return (
    <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex justify-between items-center">
      <p className="text-sm">{text}</p>
      <span className="text-xs text-gray-500">{time}</span>
    </div>
  );
}