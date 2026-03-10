"use client";

import MentorSideBar from "@/app/_component/mentorSideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Rocket, BookOpen, Sparkles, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from "sonner";
import { motion } from "framer-motion";

const Page = () => {
  const [inputValue, setInputValue] = useState({
    courseTitle: "",
    courseInfo: "",
    paymentValue: "",
  });
  const [isDeploying, setIsDeploying] = useState(false);
  
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const { push } = useRouter();

  const handleValue = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    setInputValue(prev => ({ ...prev, [name]: value }));
  };

  const createCourse = async () => {
    if (!inputValue.courseTitle || !inputValue.paymentValue) {
        toast.error("Protocol Incomplete", { description: "Please fill in the required parameters." });
        return;
    }

    setIsDeploying(true);
    try {
        const res = await fetch("/api/mentor/createCourse", {
            method: "POST",
            body: JSON.stringify({
              courseTitle: inputValue.courseTitle,
              courseInfo: inputValue.courseInfo,
              paymentValue: inputValue.paymentValue,
              mentorId: user?.id,
            }),
          });
        
          if (res.ok) {
            toast.success("Protocol Initiated", {
              description: "Your curriculum has been synchronized to the mainnet.",
              className: "bg-[#0a0a0a] border border-white/5 text-white rounded-2xl p-6 shadow-2xl",
            });
            push("/mentor/dashboard");
          }
    } catch (error) {
        toast.error("Uplink Error", { description: "Synchronization failed." });
    } finally {
        setIsDeploying(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#020202] text-slate-200 selection:bg-indigo-500/30 font-sans relative overflow-hidden">
      {/* Dark Atmosphere Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[70%] md:w-[45%] h-[45%] rounded-full bg-indigo-600/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[60%] md:w-[35%] h-[35%] rounded-full bg-purple-600/5 blur-[100px]" />
      </div>
  
      <MentorSideBar
        activeTab="home"
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/accounts")}
        editProfile={() => push("/mentor/dashboard/editProfile")}
      />
  
      <main className="flex-1 flex flex-col px-4 sm:px-8 md:px-12 py-8 md:py-12 z-10 overflow-y-auto no-scrollbar">
        {/* Back Button */}
        <div className="max-w-3xl w-full mx-auto mb-6 md:mb-8">
            <button 
                onClick={() => push("/mentor/dashboard")}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[9px] md:text-[10px] font-black uppercase tracking-widest"
            >
                <ChevronLeft size={14} /> Back to Console
            </button>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl mx-auto"
        >
          {/* Main Card Container */}
          <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 md:p-14 shadow-2xl shadow-black relative overflow-hidden">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 md:mb-12 pb-8 md:pb-10 border-b border-white/5">
              <div className="space-y-3 md:space-y-4 max-w-lg">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em]">
                  <Sparkles size={12} /> Curriculum Deployment
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tighter uppercase italic leading-none">
                  Create <span className="text-indigo-500 font-black">Course</span>
                </h1>
                <p className="text-zinc-500 text-xs md:text-sm font-medium leading-relaxed">
                  Define your professional expertise for global student access.
                </p>
              </div>
              
              {/* Decorative Icon - Hidden on very small screens to save space */}
              <div className="hidden sm:flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl md:rounded-3xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.1)] rotate-3 shrink-0">
                <BookOpen size={32} />
              </div>
            </div>
  
            {/* Form Fields */}
            <div className="space-y-6 md:space-y-8">
              {/* Title Field */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Course Title
                </label>
                <input
                  name="courseTitle"
                  onChange={handleValue}
                  placeholder="e.g. Masterclass: Advanced System Design"
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-5 text-sm md:text-base text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all"
                />
              </div>
  
              {/* Info Field */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Curriculum Overview
                </label>
                <textarea
                  name="courseInfo"
                  onChange={handleValue}
                  placeholder="Define the core objectives and outcomes of this session..."
                  className="w-full bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl px-5 md:px-6 py-4 md:py-5 h-32 md:h-44 resize-none text-sm md:text-base text-white font-medium placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all leading-relaxed"
                />
              </div>
  
              {/* Price Field */}
              <div className="space-y-2 md:space-y-3">
                <label className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                  Credit Value (USD)
                </label>
                <div className="relative">
                  <span className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-indigo-500 font-black">$</span>
                  <input
                    name="paymentValue"
                    type="number"
                    onChange={handleValue}
                    placeholder="0.00"
                    className="w-full bg-white/[0.02] border border-white/5 rounded-xl md:rounded-2xl pl-10 md:pl-12 pr-5 md:pr-6 py-4 md:py-5 text-sm md:text-base text-white font-bold placeholder:text-zinc-700 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.04] transition-all"
                  />
                </div>
              </div>
            </div>
  
            {/* Action Button */}
            <div className="mt-10 md:mt-14 pt-8 md:pt-10 border-t border-white/5">
              <button
                disabled={isDeploying}
                onClick={createCourse}
                className="w-full flex items-center justify-center gap-3 px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl bg-white text-black font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] transition-all hover:bg-indigo-500 hover:text-white active:scale-[0.98] shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeploying ? <Loader2 size={18} className="animate-spin" /> : <Rocket size={18} />}
                {isDeploying ? "Deploying..." : "Deploy Curriculum"}
              </button>
              <p className="text-center text-[8px] md:text-[9px] font-bold text-zinc-700 uppercase tracking-widest mt-5 md:mt-6 italic">
                Awaiting authorization for global synchronization
              </p>
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