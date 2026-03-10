"use client";

import { SignInButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronRight, Users, Zap, Calendar, Sparkles, ArrowRight, Github, Twitter } from "lucide-react";

const Page = () => {
  const router = useRouter();

  // Navigation Helper
  const goToSignup = () => router.push("/signup");

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      {/* BACKGROUND RADIANCE */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-[600px] bg-indigo-600/10 blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-0 w-[300px] h-[300px] bg-purple-600/5 blur-[100px] pointer-events-none -z-10" />

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-7xl mx-auto px-6 h-16">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => router.push("/")}>
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)] group-hover:scale-105 transition-transform">
              <span className="font-black text-sm">N</span>
            </div>
            <span className="text-xl font-bold tracking-tighter uppercase italic">Nexa</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Solutions</a>
            <a href="#" className="hover:text-white transition-colors">Community</a>
          </div>

          <div className="flex items-center gap-5">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white cursor-pointer transition-colors">
              <SignInButton mode="modal">Sign In</SignInButton>
            </div>
            <button 
              onClick={goToSignup}
              className="px-5 py-2.5 rounded-full bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
            >
              Join Nexa
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-48 pb-32 px-6 max-w-7xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em] mb-10 shadow-2xl">
            <Sparkles size={12} className="animate-pulse" /> The New Standard for Schools
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-[ -0.04em] leading-[0.85] mb-10">
            <span className="block text-white">CONNECT.</span>
            <span className="block text-white/40">LEARN. LEAD.</span>
            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-500 bg-[length:200%_auto] animate-gradient-x">
              TOGETHER.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed tracking-tight">
            Nexa is the unified operating system for school clubs and mentorship. 
            Scale your community, guide your peers, and build your legacy.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button 
              onClick={goToSignup}
              className="h-16 px-10 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(79,70,229,0.3)] group active:scale-95"
            >
              Start Your Journey <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={goToSignup}
              className="h-16 px-10 rounded-2xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center hover:bg-white/10 transition-all active:scale-95"
            >
              Explore Communities
            </button>
          </div>
        </motion.div>
      </section>

      {/* BENTO GRID (Snippet for context) */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-gradient-to-br from-white/[0.03] to-transparent border border-white/5 rounded-[3rem] p-10 md:p-14 relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 p-8 text-indigo-500/10 group-hover:text-indigo-500/20 transition-all duration-700 rotate-12 group-hover:rotate-0">
              <Users size={240} />
            </div>
            <h3 className="text-4xl font-bold mb-6 tracking-tighter">Centralized Club OS</h3>
            <p className="text-slate-400 text-lg max-w-md leading-relaxed">
              Ditch the scattered group chats. Manage memberships, applications, and broadcasts in a high-performance workspace.
            </p>
          </div>
          
          <div className="md:col-span-4 bg-indigo-600 rounded-[3rem] p-10 relative overflow-hidden flex flex-col justify-end min-h-[400px] shadow-2xl shadow-indigo-600/20">
             <Zap className="absolute top-10 left-10 text-white/20" size={100} />
             <h3 className="text-3xl font-bold text-white mb-3 tracking-tighter">Instant Guidance</h3>
             <p className="text-indigo-100 text-sm font-medium italic opacity-80">Subject-based peer mentorship for every student, unlocked.</p>
          </div>
        </div>
      </section>

      {/* USER ROLES */}
      <section className="max-w-7xl mx-auto px-6 py-32 border-t border-white/5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-xl">
            <h2 className="text-5xl font-bold tracking-tighter mb-6">Engineered for everyone.</h2>
            <p className="text-slate-500 text-lg">A tailored experience built specifically for the three pillars of school life.</p>
          </div>
          <button onClick={goToSignup} className="flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-[0.2em] text-[10px] hover:text-white transition-colors">
            View All Roles <ChevronRight size={14} />
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          {roles.map((item, index) => (
            <div key={index} className="group relative p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all duration-500">
              <div className="text-indigo-500/30 font-black text-4xl mb-8 group-hover:text-indigo-500 transition-colors tracking-tighter">0{index + 1}</div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{item.role}</h3>
              <p className="text-slate-400 leading-relaxed text-sm group-hover:text-slate-300 transition-colors">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center text-black">
                  <span className="font-black text-sm">N</span>
                </div>
                <span className="text-xl font-bold tracking-tighter uppercase italic">Nexa</span>
              </div>
              <p className="text-slate-500 max-w-xs text-sm leading-relaxed">
                Building the digital infrastructure for the next generation of student leaders.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-16 uppercase tracking-[0.2em] text-[10px] font-bold">
              <FooterCol title="Product" links={['Features', 'Integrations', 'Pricing']} />
              <FooterCol title="Company" links={['About', 'Careers', 'Privacy']} />
              <FooterCol title="Social" iconLinks={[<Twitter size={16}/>, <Github size={16}/>]} />
            </div>
          </div>
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              © 2026 NEXA OS. ALL RIGHTS RESERVED.
            </p>
            <div className="h-px flex-1 bg-white/5 hidden md:block mx-10" />
            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              Built for students by students.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 5s ease infinite;
        }
      `}</style>
    </div>
  );
};

const roles = [
  { role: "Students", text: "Join clubs, find mentors, and discover events tailored to your interests through an intelligent personal feed." },
  { role: "Club Leaders", text: "Automate member onboarding, track engagement analytics, and broadcast updates to your community." },
  { role: "Mentors", text: "Verified seniors sharing expertise, managing office hours, and building a professional leadership portfolio." }
];

const FooterCol = ({ title, links, iconLinks }: any) => (
  <div className="space-y-6">
    <h4 className="text-white">{title}</h4>
    <div className="space-y-4 text-slate-500">
      {links?.map((l: string) => <div key={l} className="hover:text-white cursor-pointer transition-colors">{l}</div>)}
      {iconLinks && <div className="flex gap-4">{iconLinks.map((icon: any, i: number) => <div key={i} className="hover:text-white cursor-pointer transition-colors">{icon}</div>)}</div>}
    </div>
  </div>
);

export default Page;