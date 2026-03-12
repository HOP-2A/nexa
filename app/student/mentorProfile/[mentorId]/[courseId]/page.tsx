"use client";

import SideBar from "@/app/_component/sideBar";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarIcon, CheckCircle, ChevronRight, Clock, ShieldCheck, Star, Zap, LayoutGrid, Target, Sparkles, ArrowRight } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/app/provider/authProvider";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

// Types
type AvailableDate = {
  status: string;
  startTime: string;
  endTime: string;
  id: string;
};

type Course = {
  courseTitle?: string;
  courseInfo?: string;
  paymentValue?: string | number;
};

type AuthUser = { id: string } | null;

const Page = () => {
  const { push } = useRouter();
  const params = useParams<{ mentorId: string; courseId: string }>();
  const courseId = params?.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [availableDate, setAvailableDate] = useState<AvailableDate[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isBooking, setIsBooking] = useState(false);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id) as { user: AuthUser };
  const studentId = useMemo(() => user?.id ?? null, [user]);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    try {
      const res = await fetch(`/api/course/findOne/${courseId}`);
      if (res.ok) setCourse(await res.json());
    } catch (err) {
      console.error("Course fetch failed", err);
    }
  }, [courseId]);

  const fetchDates = useCallback(async () => {
    if (!courseId) return;
    try {
      const res = await fetch("/api/mentorAvailability/mentorsDates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, date }),
      });
      if (res.ok) {
        const response = await res.json();
        setAvailableDate(Array.isArray(response) ? response : []);
      }
    } catch (err) {
      console.error("Dates fetch failed", err);
    }
  }, [courseId, date]);

  useEffect(() => {
    fetchCourse();
    fetchDates();
  }, [fetchCourse, fetchDates]);

  const handleBooking = useCallback(async (id: string) => {
    if (!studentId) {
      toast.error("Authentication Required", { description: "Please sign in to book." });
      return;
    }
    
    setIsBooking(true);
    try {
      const res = await fetch("/api/mentorAvailability/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, studentId }),
      });

      if (res.ok) {
        fetchCourse();
        fetchDates();
        toast.success("Reservation Encrypted", {
          description: "Session successfully transmitted to the secure node.",
          icon: <Zap size={16} className="text-indigo-400" />,
          style: {
            background: "#0a0a0a",
            color: "#fff",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            borderRadius: "1rem",
          },
          action: {
            label: "View Pass",
            onClick: () => push("/student/dashboard"),
          },
        });
        await fetchDates();
      }
    } catch (error) {
      toast.error("Transmission Failed", { description: "Neural link interrupted." });
    } finally {
      setIsBooking(false);
    }
  }, [studentId, fetchDates, push]);

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col md:flex-row text-slate-200 selection:bg-indigo-500/30 overflow-x-hidden">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />

      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Ambient Glow - Adjusted for responsiveness */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/5 blur-[80px] md:blur-[120px] pointer-events-none z-0" />

        <header className="px-4 md:px-8 py-6 sticky top-0 z-30 bg-[#020202]/80 backdrop-blur-xl border-b border-white/5">
          <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-slate-500">
            <LayoutGrid size={12} className="mr-2" />
            <span className="cursor-pointer hover:text-indigo-400 transition-colors hidden sm:inline">Workspace</span>
            <ChevronRight size={10} className="mx-2 md:mx-3 opacity-30 hidden sm:inline" />
            <span className="text-indigo-500">Scheduling Engine</span>
          </div>
        </header>

        <main className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto w-full space-y-8 md:space-y-12 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT: RESERVATION SYSTEM */}
            <div className="lg:col-span-7 space-y-8 md:space-y-10">
              <header className="space-y-3">
                <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] tracking-[0.3em] uppercase">
                  <Sparkles size={14} /> Availability Matrix
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-white uppercase italic leading-none">
                  Sync your <span className="text-indigo-500">Moment.</span>
                </h2>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                {/* Dark Calendar */}
                <div className="bg-[#0a0a0a] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-white/5 shadow-2xl w-full">
                   <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                      <CalendarIcon size={18} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-white">Select Date</span>
                  </div>
                  <div className="flex justify-center overflow-x-auto">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(d) => d < today}
                      className="p-0 border-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Time Grid */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 px-2">Quantum Slots</p>
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] md:max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                    {availableDate.filter(s => s.status === "AVAILABLE").length > 0 ? (
                      availableDate.map((slot) => (
                        <Dialog key={slot.id}>
                          <DialogTrigger asChild>
                            <motion.button 
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              className="group flex items-center justify-between p-4 md:p-6 bg-[#0a0a0a] border border-white/5 rounded-2xl md:rounded-3xl hover:border-indigo-500/50 transition-all text-left"
                            >
                              <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl md:rounded-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all">
                                  <Clock size={18} />
                                </div>
                                <div>
                                  <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors">{slot.startTime}</p>
                                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{slot.endTime}</p>
                                </div>
                              </div>
                              <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-all" />
                            </motion.button>
                          </DialogTrigger>
                          <DialogContent className="bg-[#0a0a0a] border-white/10 text-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 w-[90vw] max-w-md">
                            <DialogHeader>
                              <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">Confirm Session</DialogTitle>
                              <DialogDescription className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                Processing reservation for {date?.toLocaleDateString()}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-6 p-6 md:p-8 bg-indigo-600 rounded-2xl md:rounded-3xl text-center">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 mb-2">Live Window</p>
                               <p className="text-xl md:text-2xl font-black tracking-tighter">{slot.startTime} — {slot.endTime}</p>
                            </div>
                            <button 
                              disabled={isBooking}
                              className="mt-6 w-full py-4 bg-white text-black rounded-xl md:rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-indigo-500 hover:text-white disabled:opacity-50 transition-all"
                              onClick={() => handleBooking(slot.id)}
                            >
                              {isBooking ? "Encrypting..." : "Finalize Transmission"}
                            </button>
                          </DialogContent>
                        </Dialog>
                      ))
                    ) : (
                      <div className="py-16 md:py-20 text-center bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                        <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest px-4">Registry Empty for this date</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: COURSE DATA */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 space-y-6">
                
                {/* Premium Course Identity */}
                <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-[#0a0a0a] border border-white/10 p-6 md:p-10 group shadow-2xl">
                  <div className="absolute top-0 right-0 w-48 md:w-64 h-48 md:h-64 bg-indigo-600/10 rounded-full -mr-24 md:-mr-32 -mt-24 md:-mt-32 blur-[80px] group-hover:bg-indigo-600/20 transition-all duration-700" />
                  
                  <div className="relative z-10 space-y-6 md:space-y-8">
                    <div className="flex justify-between items-start">
                      <div className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">
                        Advanced Syllabus
                      </div>
                      <Zap size={20} className="text-indigo-500" />
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-none tracking-tighter text-white uppercase italic">
                      {course?.courseTitle || "Loading..."}
                    </h1>

                    <div className="pt-6 md:pt-8 border-t border-white/5 flex items-end justify-between">
                      <div>
                        <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest mb-1">Fee Tier</p>
                        <p className="text-3xl md:text-4xl font-black text-white tracking-tighter">{course?.paymentValue ?? "—"}</p>
                      </div>
                      <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-slate-400">
                        USD / ONE-TIME
                      </div>
                    </div>
                  </div>
                </div>

                {/* Technical Specs */}
                <div className="bg-[#0a0a0a] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 border border-white/5 space-y-6 md:space-y-8">
                  <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                    <Target size={16} className="text-indigo-500" />
                    Protocol Objectives
                  </h3>

                  <div className="text-slate-400 text-sm leading-relaxed font-medium">
                    {course?.courseInfo || "Documentation sync in progress..."}
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {["60min Strategic Deep-Dive", "Full Neural Resource Access", "Verified Certificate"].map((item) => (
                      <div key={item} className="flex items-center gap-4 text-[9px] md:text-[10px] font-black text-slate-400 bg-white/[0.02] p-4 rounded-xl md:rounded-2xl border border-white/5 uppercase tracking-widest">
                        <CheckCircle size={14} className="text-indigo-500 flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 flex flex-wrap gap-4 items-center justify-between border-t border-white/5 opacity-50 grayscale hover:grayscale-0 transition-all">
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tighter"><ShieldCheck size={14}/> Node Secure</div>
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-tighter"><Star size={14}/> Top tier</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(99, 102, 241, 0.1); border-radius: 10px; }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(99, 102, 241, 0.1) transparent; }
      `}</style>
    </div>
  );
};

export default Page;  