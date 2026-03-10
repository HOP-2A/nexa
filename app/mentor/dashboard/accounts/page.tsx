"use client";

import React from "react";
import MentorSideBar from "@/app/_component/mentorSideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Mail, Sparkles, Globe, Award, Fingerprint, Loader2 } from "lucide-react";

interface MentorUser {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  bio?: string;
}

const AccountPage: React.FC = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { user } = useAuth(clerkUser?.id) as { user: MentorUser | null };
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center">
        <Loader2 className="text-indigo-500 animate-spin" size={32} />
      </div>
    );
  }

  const initials = `${user?.firstname?.charAt(0) ?? ""}${user?.lastname?.charAt(0) ?? ""}` || "M";

  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-[#020202] text-slate-200 selection:bg-indigo-500/30 font-sans">
      <MentorSideBar
        activeTab="account"
        home={() => router.push("/mentor/dashboard")}
        chat={() => router.push("/mentor/chat")}
        account={() => router.push("/mentor/dashboard/accounts")}
        editProfile={() => router.push("/mentor/dashboard/editProfile")}
      />

      {/* Atmospheric Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] md:top-[-10%] md:right-[-10%] w-[60%] md:w-[40%] h-[40%] bg-indigo-600/5 blur-[80px] md:blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[50%] md:w-[30%] h-[30%] bg-purple-600/5 blur-[80px] md:blur-[120px] rounded-full" />
      </div>

      <main className="flex-1 flex flex-col items-center p-4 sm:p-8 lg:p-12 xl:p-20 z-10 relative overflow-y-auto no-scrollbar">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl"
        >
          {/* Main Profile Card */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl">
            
            {/* Header Section */}
            <div className="relative p-6 sm:p-10 md:p-16 border-b border-white/5 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-12">
                
                {/* Visual Identity */}
                <div className="relative shrink-0">
                  <div className="h-28 w-28 sm:h-32 sm:w-32 md:h-44 md:w-44 rounded-[1.5rem] md:rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-3xl sm:text-4xl md:text-6xl font-bold text-indigo-500 shadow-[0_0_50px_rgba(79,70,229,0.1)] italic transition-all">
                    {initials}
                  </div>
                  <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 h-6 w-6 md:h-8 md:w-8 bg-emerald-500 border-4 md:border-[6px] border-[#0a0a0a] rounded-full" />
                </div>

                {/* Text Identity */}
                <div className="text-center md:text-left flex-1 space-y-3 md:space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] mx-auto md:mx-0">
                    <ShieldCheck size={12} /> Verified Educator
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase italic leading-none break-words">
                    {user?.firstname ?? "Expert"} <span className="text-indigo-500 font-extrabold">{user?.lastname ?? ""}</span>
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-zinc-500 text-[11px] md:text-sm font-medium tracking-wide pt-1">
                    <span className="flex items-center gap-2 shrink-0"><Mail size={14} className="text-indigo-400/70" /> {user?.email}</span>
                    <span className="flex items-center gap-2 shrink-0"><Globe size={14} className="text-indigo-400/70" /> Global Access</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="p-6 sm:p-10 md:p-16 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-12 lg:gap-16">
              
              {/* Bio Column */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                <div className="flex items-center gap-3">
                  <Sparkles size={16} className="text-indigo-500" />
                  <h3 className="text-[9px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Professional Overview</h3>
                </div>
                <p className="text-zinc-300 text-base sm:text-lg md:text-xl leading-relaxed font-normal italic border-l-2 border-indigo-500/40 pl-4 md:pl-8 transition-all">
                  {user?.bio || "Expert biography pending synchronization. Profile active under Nexa Systems guidelines."}
                </p>
              </div>

              {/* Credentials Column */}
              <div className="space-y-4 md:space-y-5">
                <div className="flex items-center gap-3 mb-1">
                  <Award size={16} className="text-indigo-500" />
                  <h3 className="text-[9px] md:text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">Credentials</h3>
                </div>
                
                {[
                  { label: "Clearance", val: "Senior Mentor" },
                  { label: "Network", val: "Nexa Mainnet" },
                ].map((item, i) => (
                  <div key={i} className="bg-white/[0.02] border border-white/5 p-4 sm:p-6 rounded-xl md:rounded-2xl flex justify-between items-center group transition-all hover:border-white/10 hover:bg-white/[0.04]">
                    <div>
                      <p className="text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest">{item.label}</p>
                      <p className="text-xs md:text-sm font-bold text-zinc-200 mt-1 tracking-wide">
                        {item.val}
                      </p>
                    </div>
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-500/50 group-hover:bg-indigo-500 group-hover:scale-125 transition-all" />
                  </div>
                ))}
              </div>
            </div>

            {/* Security Footer */}
            <div className="bg-white/[0.01] px-6 sm:px-10 md:px-16 py-6 md:py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-600 border-t border-white/5">
               <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em]">
                 <Fingerprint size={14} className="text-zinc-600/50" /> Encrypted Identity Profile
               </div>
               <div className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                 © 2026 NEXA // CORE
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

export default AccountPage;