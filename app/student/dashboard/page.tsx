"use client";

import SideBar from "@/app/_component/sideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, ExternalLink, Users, ArrowRight, Star, CheckCircle2, LayoutGrid, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

// --- Төрлүүд ---
type AuthUser = { id: string } | null;
type Mentor = { id: string; firstname: string; profilePic: string | null; };
type StudentBookedReservation = {
  id: string; startTime: string; endTime: string; availableDate: string;
  mentor: { firstname: string; profileLink?: string; socialPlatform?: string; id: string; };
};
type ClubToStudent = { id?: string; };
type Club = { id: string; name: string; description: string; clubToStudents: ClubToStudent[]; };

const Page = () => {
  const { push } = useRouter();
  const { user: clerkUser } = useUser();

  const [mentors, setMentor] = useState<Mentor[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [studentBooked, setStudentBooked] = useState<StudentBookedReservation[]>([]);
  const [rating, setRating] = useState<"FIVE" | "FOUR" | "THREE" | "TWO" | "ONE" | "NONE">("NONE");
  const ratingMap = ["ONE", "TWO", "THREE", "FOUR", "FIVE"];

  const { user } = useAuth(clerkUser?.id) as { user: AuthUser };
  const studentId = useMemo(() => user?.id ?? null, [user]);

  const findAllmentors = useCallback(async () => {
    const res = await fetch("/api/mentor/findAllMentor");
    if (res.ok) {
      const data = await res.json();
      setMentor(Array.isArray(data) ? data : []);
    }
  }, []);

  const fetchAllClubs = useCallback(async () => {
    const res = await fetch("/api/clubToStudents/allClubs");
    if (res.ok) {
      const data = await res.json();
      setClubs(Array.isArray(data) ? data : []);
    }
  }, []);

  const fetchBooked = useCallback(async () => {
    if (!studentId) return;
    const res = await fetch("/api/mentorAvailability/studentBooked", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });
    if (res.ok) {
      const data = await res.json();
      setStudentBooked(Array.isArray(data) ? data : []);
    }
  }, [studentId]);

  const submitRating = async (mentorId: string) => {
    await fetch("/api/mentor/giveRating", {
      method: "POST",
      body: JSON.stringify({ rating, id: mentorId }),
    });
  };

  useEffect(() => {
    findAllmentors();
    fetchAllClubs();
    fetchBooked();
    if (clerkUser?.publicMetadata?.role === "MENTOR") {
      push("/mentor/dashboard");
    }
  }, [findAllmentors, fetchAllClubs, fetchBooked, clerkUser?.publicMetadata?.role, push]);

  const { upcomingSessions, pastSessions } = useMemo(() => {
    const now = new Date();
    return {
      upcomingSessions: studentBooked.filter(res => new Date(res.availableDate) >= now),
      pastSessions: studentBooked.filter(res => new Date(res.availableDate) < now)
    };
  }, [studentBooked]);

  const sortedClubs = useMemo(() => {
    return [...clubs].sort((a, b) => (b.clubToStudents?.length ?? 0) - (a.clubToStudents?.length ?? 0));
  }, [clubs]);

  return (
    <div className="min-h-screen bg-[#020202] flex flex-col md:flex-row text-slate-200 font-sans selection:bg-indigo-500/30">
      <SideBar
        activeTab="home"
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />

      <main className="flex-1 p-5 sm:p-8 md:p-12 space-y-10 md:space-y-16 overflow-x-hidden relative">
        {/* Арын гэрэлтүүлэг */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 blur-[120px] pointer-events-none" />
        
        {/* ТОЛГОЙ ХЭСЭГ */}
        <header className="relative space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-[10px] tracking-[0.2em] uppercase">
            <LayoutGrid size={14} /> Системийн удирдлага
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                Оюутны <span className="text-indigo-500">Төв</span>
              </h1>
              <p className="text-slate-400 text-sm mt-2 font-normal">Тавтай морил. Таны суралцах явц хэвийн үргэлжилж байна.</p>
            </div>
            <div className="flex items-center gap-3 bg-white/[0.03] border border-white/10 px-4 py-2 rounded-2xl backdrop-blur-md self-start">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Систем: Идэвхтэй</span>
            </div>
          </div>
        </header>

        {/* ЗАХИАЛГА УДИРДАХ ХЭСЭГ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Удахгүй болох уулзалтууд */}
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-2 text-slate-500">
              <Clock className="w-4 h-4" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest">Удахгүй болох уулзалтууд</h2>
            </div>
            
            <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar snap-x">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((res) => (
                  <motion.div 
                    key={res.id} 
                    className="snap-start flex-shrink-0 w-[290px] sm:w-[320px] bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 hover:border-indigo-500/30 transition-all duration-300 group"
                  >
                    <div className="flex justify-between items-start mb-8">
                      <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                        <Calendar size={20} />
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Огноо</p>
                        <p className="text-xs font-semibold text-white">{new Date(res.availableDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-1 mb-8">
                      <h3 className="text-lg font-bold text-white tracking-tight">Ганцаарчилсан менторшип</h3>
                      <p className="text-slate-500 text-sm font-normal">{res.mentor.firstname} ментортой</p>
                    </div>

                    <div className="flex items-center gap-4 mb-8 py-3 px-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                       <div className="flex-1">
                          <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">Хугацаа</p>
                          <p className="text-sm font-medium text-indigo-400">{res.startTime} - {res.endTime}</p>
                       </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all active:scale-95">
                          Дэлгэрэнгүй
                        </button>
                      </DialogTrigger>
                      <DialogContent className="bg-[#0d0d0d] border border-white/10 text-white rounded-3xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold">Уулзалтын мэдээлэл</DialogTitle>
                        </DialogHeader>
                        <div className="mt-6 space-y-4">
                          <div className="bg-indigo-500/10 border border-indigo-500/20 p-6 rounded-2xl text-center">
                            <p className="text-2xl font-bold text-indigo-400">{res.startTime} — {res.endTime}</p>
                            <p className="text-slate-500 text-xs mt-2 uppercase font-semibold">{new Date(res.availableDate).toDateString()}</p>
                          </div>
                          {res.mentor.profileLink && (
                            <a href={res.mentor.profileLink} target="_blank" className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all">
                              Видео дуудлагад орох <ExternalLink size={16} />
                            </a>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                ))
              ) : (
                <div className="w-full h-[220px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01]">
                  <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Идэвхтэй захиалга байхгүй</p>
                </div>
              )}
            </div>
          </div>

          {/* Бүртгэлийн түүх */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-2 text-slate-500">
              <CheckCircle2 className="w-4 h-4" />
              <h2 className="text-[10px] font-bold uppercase tracking-widest">Бүртгэлийн түүх</h2>
            </div>
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 h-[280px] overflow-y-auto no-scrollbar">
              {pastSessions.length > 0 ? (
                <div className="space-y-3">
                  {pastSessions.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-transparent hover:border-white/10 rounded-2xl transition-all group">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                          <CheckCircle2 size={14} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{item.mentor.firstname}</p>
                          <p className="text-[9px] text-slate-500 uppercase font-semibold mt-0.5">
                            {new Date(item.availableDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </p>
                        </div>
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-[9px] font-bold uppercase text-indigo-400 hover:text-white transition-colors">Үнэлэх</button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0d0d0d] border border-white/10 text-white rounded-3xl">
                          <div className="text-center py-4">
                            <h2 className="text-lg font-bold mb-6">Үнэлгээ өгөх</h2>
                            <div className="flex justify-center gap-2 mb-8">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setRating(ratingMap[star - 1] as any)}
                                  className={`text-3xl transition-all ${star <= ratingMap.indexOf(rating) + 1 ? "text-indigo-500 scale-110" : "text-slate-800"}`}
                                >
                                  ★
                                </button>
                              ))}
                            </div>
                            <button
                              disabled={rating === "NONE"}
                              onClick={() => submitRating(item.mentor.id)}
                              className="w-full py-3 bg-white text-black rounded-xl font-bold text-xs uppercase transition-all disabled:opacity-20"
                            >
                              Илгээх
                            </button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center opacity-20">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-center">Түүх хоосон</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* МЕНТОРУУДЫН ХЭСЭГ */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <h2 className="text-xl font-bold text-white">Шилдэг Менторууд</h2>
            <button className="text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-all" onClick={() => push("/student/mentors")}>
              Бүгдийг үзэх <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {mentors?.map((ment) => (
                <CarouselItem key={ment.id} className="pl-4 basis-[60%] sm:basis-1/3 lg:basis-1/5">
                  <div onClick={() => push(`/student/mentorProfile/${ment.id}`)} className="group cursor-pointer">
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 text-center transition-all duration-300 hover:border-indigo-500/30">
                      <div className="relative mb-4 inline-block">
                        <img 
                          src={ment?.profilePic || `https://ui-avatars.com/api/?name=${ment.firstname}&background=0D0D0D&color=fff`} 
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all object-cover mx-auto" 
                          alt={ment.firstname}
                        />
                      </div>
                      <h3 className="font-bold text-sm text-white">{ment.firstname}</h3>
                      <p className="text-[9px] font-semibold text-slate-600 uppercase mt-1 tracking-widest">Баталгаажсан</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* ШИЛДЭГ КЛУБУУД */}
        <section className="space-y-6 pb-12">
          <h2 className="text-xl font-bold text-white">Трэнд бүлгэмүүд</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedClubs.slice(0, 6).map((club) => (
              <div
                key={club.id}
                className="group bg-[#0a0a0a] border border-white/5 p-7 rounded-3xl hover:border-indigo-500/20 transition-all flex flex-col justify-between h-[220px]"
              >
                <div>
                  <div className="flex justify-between items-start mb-5">
                    <div className="h-10 w-10 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Users size={18} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase bg-white/5 px-2.5 py-1 rounded-lg">{club.clubToStudents.length} гишүүн</span>
                  </div>
                  <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{club.name}</h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{club.description}</p>
                </div>
                <button
                  onClick={() => push(`/student/clubForm/${club.id}`)}
                  className="w-full mt-5 py-2.5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  Нэгдэх
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Page;