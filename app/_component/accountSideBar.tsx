"use client";

import { User, Users, ChevronRight, ShieldCheck, Settings } from "lucide-react";
import { motion } from "framer-motion";

type PropsType = {
  personalInformation: () => void;
  myclubs: () => void;
  activePath?: string;
};

const AccountSideBar = ({ personalInformation, myclubs, activePath = "personal" }: PropsType) => {
  
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
    const isActive = activePath === id;

    return (
      <button
        onClick={onClick}
        className={`group relative flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-300 text-[11px] font-bold uppercase tracking-wider
          ${isActive 
            ? "text-white bg-white/[0.05] border border-white/10" 
            : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
          }`}
      >
        <div className="flex items-center gap-3 relative z-10">
          <Icon 
            size={16} 
            className={`${isActive ? "text-indigo-500" : "group-hover:text-zinc-300"} transition-colors`} 
          />
          {label}
        </div>
        
        {isActive ? (
          <motion.div layoutId="subnav-glow" className="h-1.5 w-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
        ) : (
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-1 group-hover:translate-x-0" />
        )}
      </button>
    );
  };

  return (
    <aside className="hidden lg:flex flex-col w-full h-full p-6">
      
      {/* Category Header */}
      <div className="flex items-center gap-2 mb-6 px-2">
        <Settings size={14} className="text-zinc-600" />
        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
          Account Settings
        </h2>
      </div>

      <div className="space-y-1">
        <NavButton 
          id="personal"
          icon={User} 
          label="Personal Info" 
          onClick={personalInformation} 
        />

        <NavButton 
          id="clubs"
          icon={Users} 
          label="My Clubs" 
          onClick={myclubs} 
        />
      </div>

      {/* Security Status Block */}
      <div className="mt-auto">
        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl group cursor-default">
           <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-emerald-500/80 uppercase tracking-widest">Secure Profile</span>
           </div>
           <p className="text-[10px] leading-relaxed text-zinc-500">
             Your account is verified and active on the platform.
           </p>
        </div>
      </div>
    </aside>
  );
};

export default AccountSideBar;