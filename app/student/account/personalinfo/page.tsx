"use client";

import React from "react";
import AccountSideBar from "@/app/_component/accountSideBar";
import SideBar from "@/app/_component/sideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, Fingerprint, Globe, ChevronRight } from "lucide-react";

interface UserProfile {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  bio?: string;
}

const Page: React.FC = () => {
  const { push } = useRouter();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { user } = useAuth(clerkUser?.id) as { user: UserProfile | null };

  if (!clerkLoaded) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <div className="h-10 w-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#020202] text-zinc-400 selection:bg-indigo-500/30 font-sans">
      
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-zinc-600/5 blur-[120px] rounded-full" />
      </div>

      <SideBar
        activeTab="account"
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />

      {/* Account Navigation (Secondary Sidebar) */}
      <div className="hidden lg:block w-72 border-r border-white/5 bg-[#050505]/50 backdrop-blur-xl">
        <AccountSideBar
          personalInformation={() => push("/student/account/personalinfo")}
          myclubs={() => push("/student/myClubs")}
        />
      </div>

      <main className="flex-1 p-6 md:p-16 z-10 relative overflow-y-auto no-scrollbar">
        
        {/* Header Section */}
        <header className="mb-16 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-[10px] tracking-[0.2em] uppercase">
            <Fingerprint size={14} /> Identity Authentication
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
            Profile <span className="text-indigo-500">Overview</span>
          </h1>
          <p className="text-zinc-500 text-sm font-normal max-w-md leading-relaxed">
            Manage your unique identifier and network credentials within the ecosystem.
          </p>
        </header>

        {/* Main Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl group"
        >
          <div className="relative overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 md:p-12 transition-all duration-500 group-hover:border-indigo-500/30">
            
            {/* Ambient Interior Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-3xl rounded-full -z-10 transition-all group-hover:bg-indigo-600/10" />

            <div className="flex flex-col md:flex-row md:items-center gap-8 mb-16">
              {/* Profile Avatar */}
              <div className="relative">
                <div className="h-32 w-32 rounded-3xl bg-indigo-600 flex items-center justify-center text-4xl font-bold text-white shadow-xl border border-white/10 transition-transform duration-500 group-hover:scale-105">
                  {user?.firstname?.charAt(0) ?? "N"}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-[#0d0d0d] border border-white/10 p-2 rounded-xl text-emerald-500 shadow-lg">
                  <ShieldCheck size={20} />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                  {user?.firstname ?? "User"} <span className="text-zinc-500">{user?.lastname ?? "Node"}</span>
                </h2>
                <p className="text-zinc-500 font-mono text-xs tracking-wider uppercase">
                  {user?.email ?? "unidentified_uplink@nexa.edu"}
                </p>
                <div className="flex gap-2 mt-4">
                   <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Student v1.0</span>
                   <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[9px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1">
                    <Zap size={10} /> Tier: Alpha
                   </span>
                </div>
              </div>
            </div>

            {/* BIO SECTION */}
            <div className="mb-16">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                <Globe size={14} /> Data Transcript
              </h3>
              <div className="p-8 bg-white/[0.02] border border-white/5 rounded-2xl relative group/bio">
                <p className="text-zinc-300 text-lg font-normal leading-relaxed">
                  {user?.bio || "Awaiting transcription. Define your objectives within the Nexa ecosystem to synchronize with relevant nodes."}
                </p>
                <button className="absolute bottom-4 right-4 opacity-0 group-hover/bio:opacity-100 transition-opacity text-[10px] font-bold uppercase text-indigo-400">
                  Edit Transcript
                </button>
              </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-white/5">
              
              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-default flex justify-between items-center group/metric">
                <div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Authorization</p>
                  <h4 className="text-lg font-bold text-white">Active</h4>
                </div>
                <ChevronRight size={14} className="text-zinc-800 group-hover/metric:text-zinc-400 transition-colors" />
              </div>

              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-default flex justify-between items-center group/metric">
                <div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Network Join</p>
                  <h4 className="text-lg font-bold text-white">2024.03</h4>
                </div>
                <ChevronRight size={14} className="text-zinc-800 group-hover/metric:text-zinc-400 transition-colors" />
              </div>

              <div className="p-6 bg-white/[0.01] border border-white/5 rounded-xl hover:bg-white/[0.03] transition-colors cursor-default flex justify-between items-center group/metric">
                <div>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Access Level</p>
                  <h4 className="text-lg font-bold text-indigo-500">Lvl 08</h4>
                </div>
                <ChevronRight size={14} className="text-zinc-800 group-hover/metric:text-zinc-400 transition-colors" />
              </div>

            </div>
          </div>
        </motion.div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Page;