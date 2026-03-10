"use client";

import { useState } from "react";
import { Home, User, Menu, X, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PropsType = {
  home: () => void;
  chat: () => void;
  account: () => void;
  editProfile: () => void;
  activeTab?: string;
};

const MentorSideBar = ({ home, account, activeTab = "home" }: PropsType) => {
  const [open, setOpen] = useState(false);

  const NavButton = ({ 
    icon: Icon, 
    label, 
    onClick, 
    id 
  }: { 
    icon: any, 
    label: string, 
    onClick: () => void, 
    id: string 
  }) => {
    const isActive = activeTab === id;

    return (
      <button
        onClick={() => {
          onClick();
          setOpen(false);
        }}
        className={`group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-500 text-[11px] font-bold uppercase tracking-widest
          ${isActive 
            ? "text-white bg-white/[0.05] border border-white/10 shadow-[0_0_20px_rgba(255,255,255,0.02)]" 
            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
          }`}
      >
        <Icon 
          size={16} 
          className={`${isActive ? "text-indigo-500" : "group-hover:text-zinc-300"} transition-colors`} 
        />
        {label}
        
        {isActive && (
          <motion.div 
            layoutId="mentor-nav-glow" 
            className="absolute right-3 h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(79,70,229,1)]" 
          />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-5 bg-[#020202] border-b border-white/5 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">M</div>
          <h1 className="font-bold text-white text-sm tracking-tight uppercase">Dashboard</h1>
        </div>
        <button onClick={() => setOpen(true)} className="text-zinc-400">
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Aside */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-screen w-72 bg-[#020202] border-r border-white/5 p-6 flex flex-col z-50
          transform transition-transform duration-500 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          {/* Branding */}
          <div className="flex items-center justify-between mb-12 px-2">
            <h1 className="text-xl font-black text-white uppercase tracking-tighter">
              Dashboard<span className="text-indigo-500">.</span>
            </h1>
            <button className="md:hidden text-zinc-500" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <NavButton id="home" icon={Home} label="Home" onClick={home} />
            <NavButton id="account" icon={User} label="Account" onClick={account} />
          </nav>
        </div>

        {/* Footer Status */}
        <div className="mt-auto pt-8 border-t border-white/5 space-y-6">
          <div className="p-4 bg-indigo-500/[0.03] border border-indigo-500/10 rounded-2xl group cursor-default">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={12} className="text-indigo-500" />
              <span className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Verified Mentor</span>
            </div>
            <p className="text-[10px] leading-relaxed text-zinc-600 font-medium">
              Secure session active.
            </p>
          </div>

          <div className="text-[10px] font-bold text-zinc-700 uppercase tracking-[0.2em] px-2">
            © 2026 Your App
          </div>
        </div>
      </aside>
    </>
  );
};

export default MentorSideBar;