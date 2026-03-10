"use client";
import SideBar from "@/app/_component/sideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users2, ArrowUpRight, Sparkles, Zap, Shield } from "lucide-react";

interface ClubMember {
  studentId: string;
}

interface Club {
  id: string;
  name: string;
  description: string;
  clubToStudents: ClubMember[];
}

const Page = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const { push } = useRouter();

  const fetchAllClubs = async () => {
    const res = await fetch("/api/clubToStudents/allClubs", {
      method: "GET",
    });
    const response: Club[] = await res.json();
    setClubs(response);
  };

  useEffect(() => {
    fetchAllClubs();
  }, []);

  const myClubs = clubs.filter((club) => {
    return club.clubToStudents.some((member) => member.studentId === user?.id);
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#020202] text-slate-200 selection:bg-indigo-500/30 font-sans">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-600/5 blur-[120px] rounded-full" />
      </div>

      <SideBar
        activeTab="news"
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />

      <main className="flex-1 p-5 sm:p-8 md:p-12 z-10 relative">
        {/* Header Section */}
        <header className="mb-12 md:mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-[10px] tracking-[0.2em] uppercase">
              <Zap size={14} /> Network Overview
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
              My <span className="text-indigo-500">Clubs</span>
            </h1>
            <p className="text-slate-400 text-sm font-normal max-w-md leading-relaxed">
              You are currently synchronized with <span className="text-white font-medium">{myClubs.length} active collectives.</span>
            </p>
          </div>
        </header>

        {/* Club Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {myClubs.map((club, idx) => (
            <motion.div
              key={club.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="group relative h-full"
            >
              {/* Card Container */}
              <div className="relative h-full overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/5 p-7 transition-all duration-300 group-hover:border-indigo-500/30 group-hover:bg-[#0d0d0d] flex flex-col">
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-8">
                    <div className="h-11 w-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Users2 size={22} />
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                      <Shield size={10} className="text-slate-500" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Member</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                    {club.name}
                  </h3>

                  <p className="mt-3 text-xs font-normal leading-relaxed text-slate-500 line-clamp-3">
                    {club.description || "No transmission data found for this collective. Access the portal to learn more about club activities."}
                  </p>

                  <div className="mt-auto pt-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="h-6 w-6 rounded-full border-2 border-[#0a0a0a] bg-zinc-800"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase">
                        +{club.clubToStudents?.length} Nodes
                      </span>
                    </div>

                    <button
                      className="flex items-center gap-1.5 rounded-lg bg-white text-black px-4 py-2 text-[10px] font-bold uppercase tracking-wider transition-all hover:bg-indigo-500 hover:text-white active:scale-95"
                      onClick={() => push(`/student/Clubs/${club.id}`)}
                    >
                      Enter <ArrowUpRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {myClubs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 border border-dashed border-white/5 rounded-[2.5rem] mt-8 bg-white/[0.01]">
             <Sparkles className="text-slate-800 mb-4" size={32} />
             <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-600">No Club Memberships Detected</p>
             <button 
                onClick={() => push("/student/allClubs")} 
                className="mt-5 text-indigo-400 text-[10px] font-bold uppercase tracking-widest hover:text-white transition-colors"
             >
               Browse Directory
             </button>
          </div>
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