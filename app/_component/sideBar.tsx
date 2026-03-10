"use client";

import { useState, useEffect } from "react";
import { Home, Users, Newspaper, User, Menu, X, LayoutDashboard, LogOut, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- 1. Types ---
type NavItemProps = {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  id: string;
  activeTab: string; // Required to track movement
};

type PropsType = {
  home: () => void;
  members: () => void;
  news: () => void;
  account: () => void;
  activeTab?: string; // Passed from the parent page
};

// --- 2. NavItem Sub-component ---
const NavItem = ({ icon: Icon, label, onClick, id, activeTab }: NavItemProps) => {
  const isActive = activeTab === id;
  
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-300 text-sm font-semibold tracking-tight
        ${isActive 
          ? "text-white bg-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
          : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]"
        }`}
    >
      {/* Icon with glow when active */}
      <Icon 
        size={18} 
        className={`${isActive ? "text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" : "group-hover:text-slate-200"} transition-colors`} 
      />
      
      <span className="relative z-10">{label}</span>
      
      {/* THE FIX: layoutId allows the glow to "slide" between items */}
      {isActive && (
        <motion.div 
          layoutId="sidebarHighlight"
          className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full shadow-[0_0_15px_rgba(79,70,229,0.8)]"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35
          }}
        />
      )}
    </button>
  );
};

// --- 3. Main Sidebar Component ---
const SideBar = ({ home, members, news, account, activeTab = "home" }: PropsType) => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch (Common "Red Error" fix)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* MOBILE HEADER */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#050505] border-b border-white/5 sticky top-0 z-[60]">
        <div className="flex items-center gap-2">
           <div className="h-7 w-7 bg-indigo-600 rounded flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-indigo-600/20">NX</div>
           <span className="font-bold text-sm tracking-tighter uppercase italic text-white">Nexa</span>
        </div>
        <button onClick={() => setOpen(true)} className="text-slate-400 p-1 hover:text-white transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] md:hidden"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR ASIDE */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/5 p-5 flex flex-col z-[80]
          transform transition-all duration-500 ease-in-out
          ${open ? "translate-x-0 shadow-[20px_0_40px_rgba(0,0,0,0.8)]" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="flex flex-col h-full">
          
          {/* LOGO AREA */}
          <div className="flex items-center justify-between mb-10 px-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                <LayoutDashboard size={16} className="text-white" />
              </div>
              <h1 className="text-lg font-black tracking-tighter uppercase italic text-white">
                Nexa<span className="text-indigo-500">.</span>
              </h1>
            </div>
            <button className="md:hidden text-slate-500 hover:text-white p-1" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* MAIN NAV */}
          <nav className="flex-1 space-y-1">
            <div className="px-3 mb-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Protocol</div>
            
            <NavItem id="home" icon={Home} label="Overview" activeTab={activeTab} onClick={() => { home(); setOpen(false); }} />
            <NavItem id="members" icon={Users} label="Mentors" activeTab={activeTab} onClick={() => { members(); setOpen(false); }} />
            <NavItem id="news" icon={Newspaper} label="My Clubs" activeTab={activeTab} onClick={() => { news(); setOpen(false); }} />
            
            <div className="pt-8 px-3 mb-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">Identity</div>
            <NavItem id="account" icon={User} label="Profile" activeTab={activeTab} onClick={() => { account(); setOpen(false); }} />
          </nav>

          {/* BOTTOM SECTION */}
          <div className="mt-auto pt-6 border-t border-white/5 space-y-4">
             <button className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
                <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
               Sign Out
             </button>
             
             <div className="px-4 py-3 bg-white/[0.02] border border-white/5 rounded-2xl">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mb-1">Active User</p>
                <p className="text-xs text-slate-300 font-bold truncate tracking-tight">nexa_node_01</p>
             </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;