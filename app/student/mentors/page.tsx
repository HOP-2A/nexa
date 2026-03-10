"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ArrowRight, Search, SlidersHorizontal, Sparkles, UserX } from "lucide-react";
import SideBar from "@/app/_component/sideBar";

type Mentor = {
  id: string;
  firstname: string;
  lastname: string;
  profilePic: string | null;
  rating?: number | null;
  bio?: string | null;
};

const Page = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const { push } = useRouter();
  const [inputs, setInput] = useState("");

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  useEffect(() => {
    const fetchMentors = async () => {
      const res = await fetch("/api/mentorGet", { method: "GET" });
      if (!res.ok) {
        setMentors([]);
        return;
      }
      const data: Mentor[] = await res.json();
      setMentors(Array.isArray(data) ? data : []);
    };
    fetchMentors();
  }, []);

  const filteredMentor = mentors.filter((mentor) => {
    return mentor.firstname.toLowerCase().includes(inputs.toLowerCase()) || 
           mentor.lastname.toLowerCase().includes(inputs.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020202] text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-purple-600/5 blur-[120px] rounded-full" />
      </div>

      <SideBar
        activeTab="members"
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />
      
      <main className="flex-1 p-5 sm:p-8 md:p-12 z-10 relative">
        {/* HEADER / SEARCH */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12 md:mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-[10px] tracking-[0.2em] uppercase">
              <Sparkles size={14} /> Global Directory
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white uppercase">
              Find <span className="text-indigo-500">Mentors</span>
            </h1>
            <p className="text-slate-400 text-sm font-normal max-w-md leading-relaxed">
              Connect with industry experts and accelerate your professional growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white/[0.03] border border-white/10 p-2 rounded-2xl backdrop-blur-md w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"  />
              <input 
                placeholder="Search mentors..." 
                className="bg-transparent border-none focus:ring-0 text-sm pl-10 pr-4 py-2 w-full placeholder:text-slate-600 outline-none"
                value={inputs}
                onChange={handleValue}
              />
            </div>
            <button className="flex items-center justify-center gap-2 p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5 w-full sm:w-auto">
              <SlidersHorizontal size={18} className="text-slate-400" />
              <span className="sm:hidden text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter</span>
            </button>
          </div>
        </header>

        {/* MENTOR LIST OR EMPTY STATE */}
        {filteredMentor.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {filteredMentor.map((mentor, idx) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => push(`/student/mentorProfile/${mentor.id}`)}
                className="group relative cursor-pointer h-full"
              >
                <div className="relative bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden transition-all duration-300 group-hover:border-indigo-500/30 group-hover:bg-[#0d0d0d] h-full flex flex-col">
                  
                  {/* Image Section */}
                  <div className="relative h-52 sm:h-60 w-full overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
                    <img
                      src={mentor.profilePic || `https://ui-avatars.com/api/?name=${mentor.firstname}&background=0D0D0D&color=fff`}
                      alt={mentor.firstname}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    <div className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-indigo-400 fill-indigo-400" />
                      <span className="text-[10px] font-bold text-white">{mentor.rating ?? "NEW"}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 md:p-7 pt-2 flex-1 flex flex-col justify-between relative z-20">
                    <div>
                      <h2 className="text-lg font-bold text-white tracking-tight uppercase">
                        {mentor.firstname} <span className="text-indigo-500">{mentor.lastname}</span>
                      </h2>
                      <p className="mt-3 text-[11px] md:text-xs text-slate-500 leading-relaxed line-clamp-2 font-normal">
                        {mentor.bio || "Expert professional focused on high performance and career growth."}
                      </p>
                    </div>

                    <div className="mt-6 md:mt-8 flex items-center justify-between">
                      <div className="flex -space-x-1.5">
                         <div className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-indigo-500/20" />
                         <div className="w-6 h-6 rounded-full border-2 border-[#0a0a0a] bg-purple-500/20" />
                      </div>
                      
                      <div className="h-9 w-9 bg-white text-black rounded-full flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-lg">
                        <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          /* EMPTY STATE */
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 border border-dashed border-white/5 rounded-[2.5rem] bg-white/[0.01]"
          >
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <UserX className="text-slate-600" size={32} />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">No Mentors Found</h3>
            <p className="text-slate-500 text-sm mt-2 max-w-xs text-center font-normal">
              We couldn't find any experts matching "{inputs}". Try adjusting your search term.
            </p>
            <button 
              onClick={() => setInput("")}
              className="mt-8 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        )}
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Page;