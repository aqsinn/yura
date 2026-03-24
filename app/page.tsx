"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, Code, Users, Zap, Globe, 
  Play, X, CheckCircle2, Laptop 
} from 'lucide-react';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const router = useRouter();

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate JWT/Session creation
    router.push('/dashboard'); 
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-40 flex justify-between items-center px-10 py-6 backdrop-blur-md border-b border-white/5">
        <div className="text-2xl font-black tracking-tighter hover:opacity-80 transition cursor-pointer">YURA</div>
        <div className="flex gap-8 items-center">
          <button 
            onClick={() => { setAuthMode('login'); setShowAuth(true); }} 
            className="text-sm font-medium text-gray-400 hover:text-white transition"
          >
            Login
          </button>
          <button 
            onClick={() => { setAuthMode('register'); setShowAuth(true); }} 
            className="px-5 py-2 bg-white text-black text-sm font-bold rounded-full hover:scale-105 active:scale-95 transition duration-200"
          >
            Join the Squad
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative max-w-6xl mx-auto pt-44 pb-32 px-6 text-center">
        {/* Decorative Glow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-purple-600/20 blur-[120px] -z-10 rounded-full" />
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-400 mb-8 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
          </span>
          V1.0 is now live for students
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent leading-[1.1]">
          Build projects with <br /> the right dudes.
        </h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          The platform where student creators post big ideas and instantly find the exact talent needed to ship them. Stop searching, start building.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <button 
            onClick={() => setShowAuth(true)} 
            className="group flex items-center gap-2 px-10 py-5 bg-purple-600 rounded-2xl font-bold text-lg hover:bg-purple-500 transition-all shadow-xl shadow-purple-500/25 active:scale-95"
          >
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
          </button>
          
          <button 
            onClick={() => setShowDemo(true)}
            className="group flex items-center gap-3 px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all active:scale-95"
          >
            <Play size={18} fill="currentColor" className="text-white" />
            Watch Demo
          </button>
        </div>
      </main>

      {/* --- Features Grid --- */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-40">
        <FeatureCard 
          icon={<Zap className="text-yellow-400" />} 
          title="Skill Matching" 
          desc="Our algorithm scans project needs and pings users with the perfect tech stack." 
        />
        <FeatureCard 
          icon={<Users className="text-blue-400" />} 
          title="Squad Building" 
          desc="Review applicant profiles and select your dream team with a single click." 
        />
        <FeatureCard 
          icon={<Globe className="text-green-400" />} 
          title="Global Reach" 
          desc="Ship faster by working with students worldwide who share your exact passion." 
        />
      </section>

      {/* --- Demo Modal (Glassmorphism) --- */}
      {showDemo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-[60] p-6 animate-in fade-in zoom-in duration-300">
          <div className="relative w-full max-w-5xl aspect-video bg-gradient-to-br from-white/10 to-transparent border border-white/20 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col items-center justify-center">
            <button 
              onClick={() => setShowDemo(false)}
              className="absolute top-6 right-6 z-10 p-2 bg-black/40 hover:bg-white/10 rounded-full border border-white/10 transition"
            >
              <X size={24} />
            </button>
            
            <div className="text-center space-y-4 px-10">
              <div className="mx-auto w-20 h-20 bg-purple-600/20 rounded-3xl flex items-center justify-center border border-purple-500/30 mb-4">
                <Laptop size={40} className="text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold">Yura Dashboard Preview</h2>
              <p className="text-gray-400 max-w-md">The project feed, contributor selection, and skill matching engine in action.</p>
              <div className="inline-flex items-center gap-2 text-sm text-purple-400 font-mono bg-purple-400/10 px-4 py-2 rounded-full border border-purple-400/20">
                <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                LOADING_STORYBOARD_V1.MP4
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- Auth Modal --- */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-6 animate-in fade-in duration-200">
          <div className="bg-[#0A0A0A] border border-white/10 w-full max-w-md rounded-[2.5rem] p-12 relative shadow-2xl">
            <button onClick={() => setShowAuth(false)} className="absolute top-8 right-8 text-gray-500 hover:text-white transition">
              <X size={20} />
            </button>
            
            <h2 className="text-3xl font-bold mb-2">
              {authMode === 'register' ? 'Join Yura' : 'Welcome back'}
            </h2>
            <p className="text-gray-500 text-sm mb-10 leading-relaxed">
              {authMode === 'register' 
                ? 'Create an account to start posting and joining projects.' 
                : 'Enter your details to access the platform.'}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-purple-500/50 outline-none transition" required />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Email</label>
                <input type="email" placeholder="dude@yura.com" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-purple-500/50 outline-none transition" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 ml-2">Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 focus:ring-2 ring-purple-500/50 outline-none transition" required />
              </div>
              
              <button type="submit" className="w-full py-5 bg-white text-black font-black rounded-2xl mt-4 hover:bg-gray-200 transition active:scale-[0.98]">
                {authMode === 'register' ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8">
              {authMode === 'register' ? 'Already a member?' : "New to the platform?"}{' '}
              <button 
                onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')}
                className="text-white font-bold hover:underline underline-offset-4"
              >
                {authMode === 'register' ? 'Login' : 'Sign up'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* --- Footer --- */}
      <footer className="border-t border-white/5 py-16 text-center">
        <div className="text-xl font-bold tracking-tighter mb-4">YURA</div>
        <p className="text-gray-500 text-sm italic">"Built by dudes, for the dudes."</p>
        <div className="mt-8 flex justify-center gap-6 text-gray-600 text-xs">
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 group">
      <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform duration-300">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}