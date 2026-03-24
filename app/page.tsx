"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Zap, Play, X, Rocket, Stars, Terminal, Cpu, Users2, 
  Laptop, Layers, Target, ShieldCheck, Mail
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
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-8 md:px-16 py-6 backdrop-blur-2xl border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative w-10 h-10 bg-white rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-300">
            <Rocket size={20} className="text-black" />
          </div>
          <span className="text-2xl font-black tracking-tighter uppercase">Yura</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="flex gap-8 items-center font-bold"
        >
          <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="hidden md:block text-xs tracking-widest text-gray-400 hover:text-white transition">LOGIN</button>
          <button 
            onClick={() => { setAuthMode('register'); setShowAuth(true); }} 
            className="px-6 py-2 bg-white text-black text-xs rounded-full hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-white/10"
          >
            JOIN SQUAD
          </button>
        </motion.div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative z-10 max-w-7xl mx-auto pt-56 pb-32 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black tracking-[0.2em] text-purple-400 mb-12 shadow-inner"
        >
          <Stars size={14} className="animate-spin" style={{ animationDuration: '4s' }} />
          <span>{projectCount.toLocaleString()} ACTIVE BUILDERS ON PLATFORM</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-7xl md:text-[9.5rem] font-black tracking-tighter mb-8 leading-[0.8] uppercase"
        >
          Stop Browsing. <br />
          <span className="bg-gradient-to-r from-purple-500 via-white to-blue-500 bg-clip-text text-transparent italic">Start Shipping.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed font-medium"
        >
          The elite hub for student creators. Find the dudes with the skills you need and ship your vision tonight.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col md:flex-row justify-center items-center gap-6"
        >
          <button 
            onClick={() => setShowAuth(true)} 
            className="group w-full md:w-auto px-12 py-6 bg-purple-600 rounded-2xl font-black text-lg hover:bg-purple-500 transition-all shadow-[0_15px_40px_rgba(168,85,247,0.3)] active:scale-95 flex items-center justify-center gap-3"
          >
            GET STARTED <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => setShowDemo(true)}
            className="w-full md:w-auto px-12 py-6 bg-white/5 border border-white/10 rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <Play size={20} fill="white" /> WATCH DEMO
          </button>
        </motion.div>
      </main>

      {/* --- Bento Grid: What We Do --- */}
      <section className="relative z-10 max-w-7xl mx-auto py-24 px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">ENGINEERED FOR SPEED</h2>
          <p className="text-gray-500 font-bold tracking-widest text-xs">OUR ECOSYSTEM AT A GLANCE</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-[600px]">
          <BentoItem 
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-purple-900/20 to-transparent"
            icon={<Target className="text-purple-400" />}
            title="Precision Matching"
            desc="Our algorithm bypasses the 'available?' phase by matching your stack requirements to students who have already shipped similar code."
          />
          <BentoItem 
            className="md:col-span-2 bg-white/5"
            icon={<Layers className="text-blue-400" />}
            title="Proof of Work"
            desc="Every profile is backed by verified GitHub commits and live project links. No resumes, just results."
          />
          <BentoItem 
            className="bg-white/5"
            icon={<ShieldCheck className="text-green-400" />}
            title="Verified"
            desc="Student-only ecosystem."
          />
          <BentoItem 
            className="bg-white/5"
            icon={<Zap className="text-yellow-400" />}
            title="Instant"
            desc="Find dudes in < 5 mins."
          />
        </div>
      </section>

      {/* --- Infinite Tech Marquee --- */}
      <div className="relative py-20 border-y border-white/5 overflow-hidden">
        <div className="flex gap-16 whitespace-nowrap animate-marquee">
          {['TYPESCRIPT', 'NEXT.JS', 'MONGODB', 'TAILWIND', 'PYTHON', 'AI', 'WEB3', 'FIGMA', 'NODE.JS', 'RUST'].map((t) => (
            <span key={t} className="text-6xl font-black text-white/5 hover:text-white/20 transition-colors cursor-default">{t}</span>
          ))}
          {['TYPESCRIPT', 'NEXT.JS', 'MONGODB', 'TAILWIND', 'PYTHON', 'AI', 'WEB3', 'FIGMA', 'NODE.JS', 'RUST'].map((t) => (
            <span key={`${t}-2`} className="text-6xl font-black text-white/5">{t}</span>
          ))}
        </div>
      </div>

      {/* --- Final CTA --- */}
      <section className="py-40 px-6 text-center relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/20 blur-[120px] -z-10" />
         <motion.div whileInView={{ y: [20, 0], opacity: [0, 1] }} viewport={{ once: true }}>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-10 uppercase italic">Ready to build the <br /> next big thing?</h2>
            <button onClick={() => setShowAuth(true)} className="px-16 py-8 bg-white text-black rounded-3xl font-black text-2xl hover:scale-105 active:scale-95 transition-all">
               LAUNCH YOUR SQUAD
            </button>
         </motion.div>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 border-t border-white/5 bg-black/50 backdrop-blur-3xl pt-24 pb-12 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Rocket size={16} className="text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">Yura</span>
            </div>
            <p className="text-gray-500 max-w-sm font-medium leading-relaxed">
              The premier coordination layer for student builders. We turn raw ideas into shipped products by connecting the right dudes at the right time.
            </p>
          </div>
          
          <div>
            <h4 className="font-black text-xs tracking-[0.2em] mb-6 uppercase text-white">Platform</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-500">
              <li className="hover:text-purple-400 cursor-pointer transition">Projects</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Leaderboard</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Squads</li>
              <li className="hover:text-purple-400 cursor-pointer transition">Changelog</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs tracking-[0.2em] mb-6 uppercase text-white">Connect</h4>
            <div className="flex gap-4">
            
              <FooterSocialIcon icon={<Mail size={20} />} />
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-700 uppercase">© 2026 YURA LABS • BUILT FOR YOU</p>
          <div className="flex gap-8 text-[10px] font-black tracking-widest text-gray-700 uppercase">
             <span className="hover:text-gray-400 cursor-pointer transition">Privacy</span>
             <span className="hover:text-gray-400 cursor-pointer transition">Terms</span>
             <span className="hover:text-gray-400 cursor-pointer transition">Security</span>
          </div>
        </div>
      </footer>

      {/* --- Modals --- */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal mode={authMode} setMode={setAuthMode} close={() => setShowAuth(false)} router={router} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDemo && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowDemo(false)} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl aspect-video bg-[#080808] border border-white/20 rounded-[3rem] overflow-hidden flex items-center justify-center shadow-2xl">
              <button onClick={() => setShowDemo(false)} className="absolute top-10 right-10 text-gray-500"><X size={32}/></button>
              <div className="text-center">
                <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Play size={32} fill="white" />
                </div>
                <h3 className="text-2xl font-black tracking-tighter italic uppercase">Connecting_Preview_Channel_01</h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

// --- Subcomponents ---

function BentoItem({ icon, title, desc, className }: { icon: React.ReactNode; title: string; desc: string; className?: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 0.99 }}
      className={`p-10 border border-white/5 rounded-[2.5rem] flex flex-col justify-end transition-all hover:border-white/10 ${className}`}
    >
      <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl">{icon}</div>
      <h3 className="text-2xl font-black mb-2 uppercase italic">{title}</h3>
      <p className="text-gray-500 text-sm font-semibold leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function FooterSocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer">
      {icon}
    </div>
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
        <h2 className="text-4xl font-black mb-8 tracking-tighter uppercase italic">{mode}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }} className="space-y-4">
          <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500 font-bold text-xs tracking-widest transition-all" required />
          <input type="password" placeholder="PASSWORD" className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 outline-none focus:border-purple-500 font-bold text-xs tracking-widest transition-all" required />
          <button className="w-full py-5 bg-white text-black font-black rounded-2xl mt-4 hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-[0.98]">
            INITIATE
          </button>
        </form>
        
        <button onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="mt-8 text-[10px] font-black text-gray-600 hover:text-white tracking-[0.3em]">
          SWITCH TO {mode === 'register' ? 'LOGIN' : 'REGISTER'}
        </button>
      </motion.div>
    </div>
  );
}