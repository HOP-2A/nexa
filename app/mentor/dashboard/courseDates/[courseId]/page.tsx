"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Clock2Icon,
  CalendarDays,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import MentorSideBar from "@/app/_component/mentorSideBar";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Page = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const params = useParams<{ courseId: string }>();
  const courseId = params.courseId;
  const { push } = useRouter();

  const [timeValue, setTimeValue] = useState({
    startTime: "",
    endTime: "",
  });

  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setTimeValue((prev) => ({ ...prev, [name]: value }));
  };

  const mentorAvailable = async () => {
    if (!date || !timeValue.startTime || !timeValue.endTime) {
      toast.error("Input Required", { description: "Please complete the timeline parameters." });
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/mentorAvailable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mentorId: user?.id,
          courseId,
          availableDate: date,
          startTime: timeValue.startTime,
          endTime: timeValue.endTime,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
        toast.success("Timeline Updated", {
          description: "Your availability has been synchronized.",
          className: "bg-[#0a0a0a] border border-white/5 text-white rounded-2xl p-6 shadow-2xl",
        });
      }
    } catch (error) {
      toast.error("Sync Error", { description: "Failed to connect to the terminal." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#020202] text-slate-200 font-sans">
      <MentorSideBar
        activeTab="home"
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/accounts")}
        editProfile={() => push("/mentor/dashboard/editProfile")}
      />

      <main className="relative flex-1 p-4 sm:p-8 lg:p-12 z-10 overflow-y-auto no-scrollbar">
        
        {/* Atmosphere Blobs - Scaled for mobile */}
        <div className="absolute top-0 right-0 h-[300px] md:h-[500px] w-[300px] md:w-[500px] rounded-full bg-indigo-600/5 blur-[80px] md:blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-[250px] md:h-[400px] w-[250px] md:w-[400px] rounded-full bg-purple-600/5 blur-[70px] md:blur-[100px] pointer-events-none" />

        <div className="mx-auto w-full max-w-6xl space-y-8 md:space-y-12">
          
          {/* HEADER SECTION */}
          <header className="text-center space-y-3 md:space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em]"
            >
              <Sparkles size={12} /> Scheduling Protocol
            </motion.div>
            
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-white uppercase italic">
              Set Your <span className="text-indigo-500 font-black">Timeline</span>
            </h1>
            <p className="text-zinc-500 text-xs md:text-base max-w-md mx-auto font-medium leading-relaxed">
              Synchronize your availability for student transmissions.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            
            {/* CALENDAR SECTION */}
            <div className="lg:col-span-7">
              <Card className="border-white/5 bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden">
                <CardContent className="p-5 sm:p-8 md:p-10 space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <CalendarDays className="h-4 w-4 text-indigo-500" />
                    <span className="font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Select Transmission Date</span>
                  </div>
                  
                  {/* Calendar container with horizontal scroll safety for small phones */}
                  <div className="flex justify-center calendar-dark-theme overflow-x-auto pb-2">
                    <Calendar
                      disabled={(d) => d < today}
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-2xl border border-white/5 bg-white/[0.02] p-2 sm:p-4 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* TIME & ACTION SECTION */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* INPUT CARD */}
              <Card className="border-white/5 bg-[#0a0a0a] rounded-[1.5rem] md:rounded-[2.5rem]">
                <CardContent className="p-6 md:p-8 space-y-6 md:space-y-8">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <Clock2Icon className="h-4 w-4 text-indigo-500" />
                    <span className="font-bold uppercase tracking-[0.2em] text-[9px] md:text-[10px]">Operational Hours</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
                    <div className="space-y-2">
                      <label className="text-[8px] md:text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">Start Phase</label>
                      <input
                        type="time"
                        name="startTime"
                        onChange={handleInputValue}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl p-4 text-sm md:text-base text-white font-bold focus:border-indigo-500/50 focus:outline-none transition-all appearance-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[8px] md:text-[9px] font-black text-zinc-600 uppercase tracking-widest ml-1">End Phase</label>
                      <input
                        type="time"
                        name="endTime"
                        onChange={handleInputValue}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl p-4 text-sm md:text-base text-white font-bold focus:border-indigo-500/50 focus:outline-none transition-all appearance-none"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* SUMMARY BOX */}
              <div className="p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] bg-indigo-600 border border-indigo-400/20 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform hidden sm:block">
                  <ShieldCheck size={100} strokeWidth={1} />
                </div>
                
                <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] opacity-80">Timeline Preview</p>
                <h3 className="text-xl md:text-2xl font-bold mt-3 md:mt-4 tracking-tight uppercase">
                  {date?.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                </h3>
                <p className="text-indigo-100 font-bold mt-1 text-xs md:text-sm">
                  {timeValue.startTime ? `${timeValue.startTime} — ${timeValue.endTime}` : "Awaiting time input..."}
                </p>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                onClick={mentorAvailable}
                disabled={loading || !date || !timeValue.startTime}
                className="w-full py-4 md:py-5 rounded-xl md:rounded-2xl bg-white text-black font-black text-[10px] md:text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all active:scale-[0.98] disabled:opacity-20 flex items-center justify-center gap-3 shadow-xl shadow-white/5"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={18} /> Protocol Saved
                  </>
                ) : (
                  <>
                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Confirm Availability"}
                    {!loading && <ArrowRight size={16} />}
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </main>

      <style jsx global>{`
        .calendar-dark-theme .rdp { 
          --rdp-accent-color: #6366f1; 
          --rdp-background-color: #1e1e1e; 
          color: white; 
          margin: 0;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Adjusting calendar size for smaller screens */
        @media (max-width: 640px) {
          .rdp-months { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default Page;