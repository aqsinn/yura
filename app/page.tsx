"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, Zap, Play, X, Rocket, Stars, Terminal, Cpu, Users2, 
  Laptop, Layers, Target, ShieldCheck, Mail, Menu
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
        <div className="absolute top-[-10%] left-[-5%] md:top-[-20%] md:left-[-10%] w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-purple-600/10 blur-[80px] md:blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-5%] right-[-2%] md:bottom-[-10%] md:right-[-5%] w-[250px] h-[250px] md:w-[600px] md:h-[600px] bg-blue-600/10 blur-[80px] md:blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- Navigation --- */}
      <nav className="fixed top-0 w-full z-[100] flex justify-between items-center px-6 md:px-16 py-4 md:py-6 backdrop-blur-2xl border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="relative w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg md:rounded-xl flex items-center justify-center group-hover:rotate-12 transition-all duration-300">
            <Rocket size={18} className="text-black md:scale-110" />
          </div>
          <span className="text-xl md:text-2xl font-black tracking-tighter uppercase">Yura</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          className="flex gap-4 md:gap-8 items-center font-bold"
        >
          <button onClick={() => { setAuthMode('login'); setShowAuth(true); }} className="hidden sm:block text-[10px] tracking-widest text-gray-400 hover:text-white transition uppercase">Login</button>
          <button 
            onClick={() => { setAuthMode('register'); setShowAuth(true); }} 
            className="px-5 py-2 md:px-6 md:py-2 bg-white text-black text-[10px] md:text-xs font-black rounded-full hover:bg-purple-500 hover:text-white transition-all shadow-lg shadow-white/5 uppercase"
          >
            Join Squad
          </button>
        </motion.div>
      </nav>

      {/* --- Hero Section --- */}
      <main className="relative z-10 max-w-7xl mx-auto pt-32 md:pt-56 pb-20 md:pb-32 px-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 md:gap-3 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] md:text-[10px] font-black tracking-[0.2em] text-purple-400 mb-8 md:mb-12"
        >
          <Stars size={12} className="animate-spin-slow" />
          <span className="uppercase">{projectCount.toLocaleString()} ACTIVE BUILDERS ONLINE</span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl md:text-8xl lg:text-[8.5rem] font-black tracking-tighter mb-6 md:mb-8 leading-[0.9] uppercase"
        >
          Stop Browsing. <br />
          <span className="bg-gradient-to-r from-purple-500 via-white to-blue-500 bg-clip-text text-transparent italic">Start Shipping.</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 md:mb-16 leading-relaxed font-medium px-4"
        >
          The elite hub for student creators. Coordinate with high-skill builders and deploy your vision before the weekend ends.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 md:gap-6 px-4"
        >
          <button 
            onClick={() => setShowAuth(true)} 
            className="group w-full sm:w-auto px-10 py-5 md:px-12 md:py-6 bg-purple-600 rounded-2xl font-black text-base md:text-lg hover:bg-purple-500 transition-all shadow-[0_15px_40px_rgba(168,85,247,0.2)] active:scale-95 flex items-center justify-center gap-3 uppercase italic"
          >
            Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => setShowDemo(true)}
            className="w-full sm:w-auto px-10 py-5 md:px-12 md:py-6 bg-white/5 border border-white/10 rounded-2xl font-black text-base md:text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3 uppercase italic"
          >
            <Play size={18} fill="white" /> Watch Demo
          </button>
        </motion.div>
      </main>

      {/* --- Bento Grid --- */}
      <section className="relative z-10 max-w-7xl mx-auto py-16 md:py-24 px-6">
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter mb-4 uppercase">Engineered for Speed</h2>
          <p className="text-gray-600 font-black tracking-[0.3em] text-[10px] uppercase">Coordination Layer V2.0</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-fr md:h-[600px]">
          <BentoItem 
            className="md:col-span-2 md:row-span-2 bg-gradient-to-br from-purple-900/10 to-transparent"
            icon={<Target className="text-purple-400" />}
            title="Precision Matching"
            desc="Our neural algorithm matches your stack requirements to builders with verified shipping history."
          />
          <BentoItem 
            className="md:col-span-2 bg-white/[0.03]"
            icon={<Layers className="text-blue-400" />}
            title="Proof of Work"
            desc="No resumes. We verify GitHub commits and live deployments so you know they can build."
          />
          <BentoItem 
            className="bg-white/[0.03]"
            icon={<ShieldCheck className="text-green-400" />}
            title="Verified"
            desc="Student-only gated network."
          />
          <BentoItem 
            className="bg-white/[0.03]"
            icon={<Zap className="text-yellow-400" />}
            title="Instant"
            desc="Assemble squads in minutes."
          />
        </div>
      </section>

      {/* --- Marquee --- */}
     {/* --- Marquee --- */}
<div className="relative py-12 md:py-20 border-y border-white/5 overflow-hidden">
  <div className="flex gap-8 md:gap-16 whitespace-nowrap animate-marquee">
    {[
      'VIOLENT REFACTOR', 'LATENCY KILLER', 'ZERO MERCY', 'HOSTILE TAKEOVER', 
      'CARBON FIBER STACK', 'BRUTE FORCE', 'PEER DESTRUCTION', 'GOD PROTOCOL', 
      'TOTAL DOMINANCE', 'SHADOW DEPLOY', 'LETHAL ARCH', 'STEROID OPS'
    ].map((t) => (
      <span key={t} className="text-4xl md:text-8xl font-black text-white/[0.03] hover:text-purple-500/40 transition-all duration-300 cursor-default uppercase italic tracking-tighter">
        {t}
      </span>
    ))}
    {/* Duplicate for seamless loop */}
    {[
      'VIOLENT REFACTOR', 'LATENCY KILLER', 'ZERO MERCY', 'HOSTILE TAKEOVER', 
      'CARBON FIBER STACK', 'BRUTE FORCE', 'PEER DESTRUCTION', 'GOD PROTOCOL', 
      'TOTAL DOMINANCE', 'SHADOW DEPLOY', 'LETHAL ARCH', 'STEROID OPS'
    ].map((t) => (
      <span key={`${t}-2`} className="text-4xl md:text-8xl font-black text-white/[0.12] uppercase italic tracking-tighter">
        {t}
      </span>
    ))}
  </div>
</div>

      {/* --- Final CTA --- */}
      <section className="py-24 md:py-40 px-6 text-center relative">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] -z-10" />
         <motion.div whileInView={{ y: [20, 0], opacity: [0, 1] }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight mb-8 md:mb-12 uppercase italic leading-none">Ready to deploy <br className="hidden md:block"/> your vision?</h2>
            <button onClick={() => setShowAuth(true)} className="px-10 py-6 md:px-16 md:py-8 bg-white text-black rounded-2xl md:rounded-3xl font-black text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all uppercase italic tracking-tighter shadow-2xl shadow-white/5">
               Launch Squad
            </button>
         </motion.div>
      </section>

      {/* --- Footer --- */}
      <footer className="relative z-10 border-t border-white/5 bg-[#050505] pt-16 md:pt-24 pb-12 px-8 md:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mb-16 md:mb-20 text-center sm:text-left">
          <div className="sm:col-span-2">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <Rocket size={16} className="text-black" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">Yura</span>
            </div>
            <p className="text-gray-500 max-w-sm font-medium leading-relaxed mx-auto sm:mx-0">
              The premier coordination layer for student builders. We turn raw ideas into shipped products.
            </p>
          </div>
          
          <div>
            <h4 className="font-black text-[10px] tracking-[0.3em] mb-6 uppercase text-gray-400">Platform</h4>
            <ul className="space-y-4 text-xs font-bold text-gray-600">
              <li className="hover:text-white cursor-pointer transition uppercase tracking-widest">Projects</li>
              <li className="hover:text-white cursor-pointer transition uppercase tracking-widest">Squads</li>
              <li className="hover:text-white cursor-pointer transition uppercase tracking-widest">Changelog</li>
            </ul>
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h4 className="font-black text-[10px] tracking-[0.3em] mb-6 uppercase text-gray-400">Social</h4>
            <FooterSocialIcon icon={<Mail size={18} />} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[9px] font-black tracking-[0.4em] text-gray-800 uppercase">© 2026 YURA LABS • BUILT FOR STUDENTS</p>
          <div className="flex gap-6 text-[9px] font-black tracking-widest text-gray-800 uppercase">
             <span className="hover:text-gray-400 cursor-pointer transition">Privacy</span>
             <span className="hover:text-gray-400 cursor-pointer transition">Terms</span>
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
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl aspect-video bg-[#080808] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden flex items-center justify-center shadow-2xl">
              <button onClick={() => setShowDemo(false)} className="absolute top-6 right-6 md:top-10 md:right-10 text-gray-500 hover:text-white transition"><X size={24}/></button>
              <div className="text-center px-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                  <Play size={28} fill="white" />
                </div>
                <h3 className="text-xl md:text-2xl font-black tracking-tighter italic uppercase">Connecting_Preview_Channel</h3>
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
        .animate-marquee { animation: marquee 25s linear infinite; }
        .animate-spin-slow { animation: spin 6s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// --- Subcomponents ---

function BentoItem({ icon, title, desc, className }: { icon: React.ReactNode; title: string; desc: string; className?: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-8 md:p-10 border border-white/5 rounded-[2rem] md:rounded-[2.5rem] flex flex-col justify-end transition-all hover:border-purple-500/20 hover:bg-white/[0.05] ${className}`}
    >
      <div className="mb-6 p-3 md:p-4 bg-white/5 w-fit rounded-xl md:rounded-2xl">{icon}</div>
      <h3 className="text-xl md:text-2xl font-black mb-2 uppercase italic tracking-tighter">{title}</h3>
      <p className="text-gray-500 text-xs md:text-sm font-semibold leading-relaxed tracking-tight">{desc}</p>
    </motion.div>
  );
}

function FooterSocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-600 hover:text-white hover:bg-white/10 transition-all cursor-pointer">
      {icon}
    </div>
  );
}

function AuthModal({ mode, setMode, close, router }: any) {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
      <motion.div 
        initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
        className="relative bg-[#080808] border border-white/10 w-full max-w-md rounded-[2.5rem] md:rounded-[3.5rem] p-10 md:p-16 shadow-2xl"
      >
        <button onClick={close} className="absolute top-8 right-8 text-gray-600 hover:text-white transition"><X size={20}/></button>
        <h2 className="text-3xl md:text-4xl font-black mb-8 tracking-tighter uppercase italic text-center">{mode}</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }} className="space-y-4">
          <input type="email" placeholder="EMAIL ADDRESS" className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-purple-500 font-black text-[10px] tracking-widest transition-all placeholder:text-gray-700 uppercase" required />
          <input type="password" placeholder="PASSWORD" className="w-full bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-4 md:p-5 outline-none focus:border-purple-500 font-black text-[10px] tracking-widest transition-all placeholder:text-gray-700 uppercase" required />
          <button className="w-full py-4 md:py-5 bg-white text-black font-black rounded-xl md:rounded-2xl mt-4 hover:bg-purple-600 hover:text-white transition-all shadow-xl active:scale-[0.98] uppercase italic">
            Initiate
          </button>
        </form>
        
        <button onClick={() => setMode(mode === 'register' ? 'login' : 'register')} className="w-full mt-8 text-[9px] font-black text-gray-700 hover:text-purple-400 tracking-[0.3em] uppercase transition-colors">
          Switch to {mode === 'register' ? 'Login' : 'Register'}
        </button>
      </motion.div>
    </div>
  );
}