"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Zap, Play, X, Rocket, Stars, Terminal, Cpu, Users2, Laptop
} from 'lucide-react';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [projectCount, setProjectCount] = useState(1840);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setProjectCount(prev => prev + Math.floor(Math.random() * 2));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020202] text-white selection:bg-purple-500/40 overflow-x-hidden font-sans">
      
      {/* --- Ambient Background --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-8 md:px-16 py-6 backdrop-blur-2xl border-b border-white/5">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-300">
            <Rocket size={20} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Yura</span>
        </div>
        
        <div className="flex gap-8 items-center font-bold">
          <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="hidden md:block text-xs tracking-widest text-gray-400 hover:text-white transition">LOGIN</button>
          <button 
            onClick={() => { setAuthMode('register'); setShowAuth(true); }} 
            className="px-6 py-2 bg-white text-black text-xs rounded-full hover:bg-purple-500 hover:text-white transition-all"
          >
            JOIN SQUAD
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative z-10 max-w-7xl mx-auto pt-56 pb-32 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.2em] text-purple-400 mb-12"
        >
          <Stars size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span>{projectCount.toLocaleString()} ACTIVE BUILDERS ON PLATFORM</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-[9rem] font-black tracking-tighter mb-8 leading-[0.85] uppercase"
        >
          Stop Browsing. <br />
          <span className="bg-gradient-to-r from-purple-500 via-white to-blue-500 bg-clip-text text-transparent italic">Start Shipping.</span>
        </motion.h1>
        
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed">
          The elite hub for student creators. Find the dudes with the skills you need and ship your vision tonight.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-center gap-6">
          <button 
            onClick={() => setShowAuth(true)} 
            className="w-full md:w-auto px-12 py-6 bg-purple-600 rounded-2xl font-black text-lg hover:bg-purple-500 transition-all shadow-[0_15px_40px_rgba(168,85,247,0.3)] active:scale-95 flex items-center justify-center gap-3"
          >
            GET STARTED <ArrowRight size={22} />
          </button>
          
          <button 
            onClick={() => setShowDemo(true)}
            className="w-full md:w-auto px-12 py-6 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <Play size={20} fill="white" /> WATCH DEMO
          </button>
        </div>
      </main>

      {/* --- Tech Marquee --- */}
      <div className="relative py-20 border-y border-white/5 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap animate-marquee">
          {['TYPESCRIPT', 'NEXT.JS', 'MONGODB', 'TAILWIND', 'PYTHON', 'AI', 'WEB3', 'FIGMA'].map((t) => (
            <span key={t} className="text-6xl font-black text-white/5">{t}</span>
          ))}
          {['TYPESCRIPT', 'NEXT.JS', 'MONGODB', 'TAILWIND', 'PYTHON', 'AI', 'WEB3', 'FIGMA'].map((t) => (
            <span key={`${t}-2`} className="text-6xl font-black text-white/5">{t}</span>
          ))}
        </div>
      </div>

      {/* --- Feature Grid --- */}
      <section className="max-w-7xl mx-auto py-32 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Cpu />} 
          title="Neural Match" 
          desc="Instantly find collaborators with the exact tech stack your project requires." 
        />
        <FeatureCard 
          icon={<Users2 />} 
          title="The Squad" 
          desc="Build teams with students who have verified proof-of-work and GitHub commits." 
        />
        <FeatureCard 
          icon={<Terminal />} 
          title="Fast Flow" 
          desc="A minimalist dashboard built for speed. No bloat, just the code and the dudes." 
        />
      </section>

      {/* --- Modals --- */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal mode={authMode} setMode={setAuthMode} close={() => setShowAuth(false)} router={router} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDemo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDemo(false)} className="absolute inset-0 bg-black/95 backdrop-blur-2xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl aspect-video bg-[#080808] border border-white/20 rounded-[3rem] overflow-hidden flex items-center justify-center shadow-2xl">
              <button onClick={() => setShowDemo(false)} className="absolute top-10 right-10 text-gray-500"><X size={32}/></button>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Play size={32} fill="white" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter italic">CONNECTING_PREVIEW...</h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="py-20 text-center border-t border-white/5 opacity-50">
        <p className="text-[10px] font-black tracking-[0.4em] uppercase">© 2026 YURA LABS • SHIPPED FROM THE DORM</p>
      </footer>

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
      `}</style>
    </div>
  );
}

// --- Subcomponents with Fixed Types ---

function FeatureCard({ icon, title, desc }: { icon: React.ReactElement; title: string; desc: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-12 bg-white/[0.02] border border-white/5 rounded-[3rem] group transition-colors hover:border-purple-500/30"
    >
      <div className="mb-8 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-purple-500/20 transition-all">
        {/* Fixed the 'size' prop error with type casting */}
        {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
      </div>
      <h3 className="text-2xl font-black mb-4 uppercase italic">{title}</h3>
      <p className="text-gray-500 leading-relaxed font-medium">{desc}</p>
    </motion.div>
  );
}

function AuthModal({ mode, setMode, close, router }: any) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 text-center">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      <motion.div 
        initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
        className="relative bg-[#050505] border border-white/10 w-full max-w-md rounded-[3.5rem] p-16 shadow-2xl"
      >
        <button onClick={close} className="absolute top-10 right-10 text-gray-500 hover:text-white transition"><X /></button>
        <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase">{mode}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }} className="space-y-4">
          <input type="email" placeholder="EMAIL" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500 font-bold text-sm tracking-widest" required />
          <input type="password" placeholder="PASSWORD" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500 font-bold text-sm tracking-widest" required />
          <button className="w-full py-5 bg-white text-black font-black rounded-2xl mt-4 hover:bg-purple-600 hover:text-white transition-all shadow-xl">
            CONTINUE
          </button>
        </form>
        
        <button onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="mt-8 text-[10px] font-black text-gray-600 hover:text-white tracking-[0.3em]">
          SWITCH TO {mode === 'register' ? 'LOGIN' : 'REGISTER'}
        </button>
      </motion.div>
    </div>
  );
}