"use client";

import MentorSideBar from "@/app/_component/mentorSideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Plus, 
  ChevronRight, 
  GraduationCap, 
  LayoutDashboard, 
  ArrowUpRight,
  Settings2,
  Activity
} from "lucide-react";

type Course = {
  id: string;
  courseTitle: string;
  courseInfo?: string | null;
  paymentValue?: string | number | null;
};

const Page = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const { push } = useRouter();

  const fetchCourses = async () => {
    if (!user?.id) return;
    const data = await fetch(`/api/course/findSpecificCourse/${user.id}`, {
      method: "GET",
    });
    if (!data.ok) {
      setCourses([]);
      return;
    }
    const res = (await data.json()) as Course[];
    setCourses(Array.isArray(res) ? res : []);
  };

  useEffect(() => {
    if (user?.id) fetchCourses();
  }, [user?.id]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020202] text-slate-200 selection:bg-indigo-500/30 font-sans antialiased">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <MentorSideBar
        activeTab="home"
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/accounts")}
        editProfile={() => push("/mentor/dashboard/editProfile")}
      />

      <main className="flex-1 p-6 sm:p-10 md:p-16 z-10 relative overflow-y-auto no-scrollbar">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] tracking-[0.3em] uppercase">
              <Activity size={14} /> System Status: Online
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tighter text-white uppercase">
              Expert <span className="text-indigo-500">Console</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium max-w-sm leading-relaxed">
              Unified interface for curriculum deployment and session synchronization.
            </p>
          </div>

          <button
            onClick={() => push("/mentor/dashboard/createCourse")}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-bold text-[11px] uppercase tracking-[0.2em] hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-2xl shadow-white/5"
          >
            <Plus size={18} /> New Curriculum
          </button>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Primary Quick Actions */}
          <div className="xl:col-span-4 space-y-6">
             <div className="flex items-center gap-2 text-zinc-500 font-bold text-[10px] uppercase tracking-widest mb-2 ml-2">
               Quick Access
             </div>
             
             <motion.div
                whileHover={{ y: -4 }}
                onClick={() => push("/mentor/reservation")}
                className="group cursor-pointer p-8 rounded-[2.5rem] bg-zinc-900/50 border border-white/5 hover:border-indigo-500/30 transition-all duration-500 shadow-2xl"
              >
                <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110">
                  <Calendar size={22} />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight uppercase">Reservations</h3>
                <p className="text-zinc-500 text-xs mt-3 leading-relaxed font-medium">
                  Review and authorize student booking requests.
                </p>
                <div className="mt-8 flex items-center text-indigo-400 font-bold text-[9px] uppercase tracking-[0.2em]">
                  Manage Schedule <ArrowUpRight size={14} className="ml-1 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </motion.div>

              <div className="p-8 rounded-[2.5rem] bg-zinc-900/20 border border-white/5">
                <Settings2 size={20} className="text-zinc-500 mb-6" />
                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Node Settings</h3>
                <p className="text-zinc-500 text-[11px] mt-2 font-medium">Configure transmission preferences and bio data.</p>
                <button 
                  onClick={() => push("/mentor/dashboard/accounts")}
                  className="mt-6 w-full py-3 bg-white/5 hover:bg-white hover:text-black rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all"
                >
                  Manage Profile
                </button>
              </div>
          </div>

          {/* Compact Course Management */}
          <div className="xl:col-span-8">
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[3rem] p-8 md:p-12 shadow-2xl h-full">
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <GraduationCap size={14} /> Portfolio
                  </div>
                  <h2 className="text-2xl font-bold text-white uppercase">Active Curriculum</h2>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-3xl font-bold text-white leading-none tracking-tighter">{courses.length}</span>
                  <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Total Active</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    whileHover={{ scale: 0.98 }}
                    onClick={() => push(`/mentor/dashboard/courseDates/${course.id}`)}
                    className="group cursor-pointer flex items-center gap-5 p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all"
                  >
                    <div className="w-12 h-12 shrink-0 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center font-bold text-lg text-zinc-400 group-hover:text-white transition-all">
                      {course.courseTitle?.charAt(0) ?? "C"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-[14px] truncate uppercase tracking-tight group-hover:text-indigo-400 transition-colors">
                        {course.courseTitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
                          ${course.paymentValue || "0.00"}
                        </span>
                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                        <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest truncate">Manage Node</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-zinc-800 group-hover:text-white transition-colors" />
                  </motion.div>
                ))}
                
                {courses.length === 0 && (
                  <div className="col-span-2 py-20 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2.5rem]">
                    <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-[0.4em] mb-6">No Active Curriculums</p>
                    <button 
                      onClick={() => push("/mentor/dashboard/createCourse")}
                      className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                    >
                      Initialize Unit
                    </button>
                  </div>
                )}

                {/* Compact Add Button */}
                {courses.length > 0 && (
                   <motion.div
                    onClick={() => push("/mentor/dashboard/createCourse")}
                    className="flex items-center justify-center p-5 rounded-2xl border border-dashed border-white/5 hover:border-indigo-500/20 hover:bg-indigo-500/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3 text-zinc-600 font-bold text-[9px] uppercase tracking-widest">
                      <Plus size={14} /> Add New Entry
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Page;