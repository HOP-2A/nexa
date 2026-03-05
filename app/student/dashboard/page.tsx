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
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Clock, ExternalLink, Users, ArrowRight } from "lucide-react";

// --- Types ---
type AuthUser = { id: string } | null;

type Mentor = {
  id: string;
  firstname: string;
  profilePic: string | null;
};

type StudentBookedReservation = {
  id: string;
  startTime: string;
  endTime: string;
  availableDate: string;
  mentor: {
    firstname: string;
    profileLink?: string;
    socialPlatform?: string;
  };
};

type ClubToStudent = {
  id?: string;
};

type Club = {
  id: string;
  name: string;
  description: string;
  clubToStudents: ClubToStudent[];
};

const Page = () => {
  const { push } = useRouter();
  const { user: clerkUser } = useUser();

  const [mentors, setMentor] = useState<Mentor[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [studentBooked, setStudentBooked] = useState<StudentBookedReservation[]>([]);

  const { user } = useAuth(clerkUser?.id) as { user: AuthUser };
  const studentId = useMemo(() => user?.id ?? null, [user]);

  // --- Data Fetching ---
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

  useEffect(() => {
    findAllmentors();
    fetchAllClubs();
    fetchBooked();

    if (clerkUser?.publicMetadata?.role === "MENTOR") {
      push("/mentor/dashboard");
    }
  }, [findAllmentors, fetchAllClubs, fetchBooked, clerkUser?.publicMetadata?.role, push]);

  // --- Logic: Filtering Dates ---
  const { upcomingSessions, pastSessions } = useMemo(() => {
    const now = new Date();
    // Reset hours to compare just dates if preferred, or keep as is for precise timing
    return {
      upcomingSessions: studentBooked.filter(res => new Date(res.availableDate) >= now),
      pastSessions: studentBooked.filter(res => new Date(res.availableDate) < now)
    };
  }, [studentBooked]);

  const sortedClubs = useMemo(() => {
    return [...clubs].sort((a, b) => (b.clubToStudents?.length ?? 0) - (a.clubToStudents?.length ?? 0));
  }, [clubs]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex font-sans text-slate-900 selection:bg-indigo-100">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />

      <main className="flex-1 p-6 lg:p-12 space-y-12 overflow-x-hidden">
        
        {/* HERO HEADER */}
        <header className="relative py-6">
          <div className="absolute -top-12 -left-12 w-72 h-72 bg-indigo-300/20 rounded-full blur-[100px] -z-10" />
          <div className="absolute top-0 right-24 w-48 h-48 bg-purple-300/20 rounded-full blur-[80px] -z-10" />
          <h1 className="text-6xl font-black tracking-tighter bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-600 bg-clip-text text-transparent">
            Student Hub
          </h1>
          <p className="text-slate-500 font-medium mt-2">Welcome back! Here is what's happening today.</p>
        </header>

        {/* BOOKING MANAGEMENT */}
        <section className="space-y-6">
          <div className="flex items-center gap-2">
             <div className="h-2 w-8 bg-indigo-600 rounded-full" />
             <h2 className="text-2xl font-bold tracking-tight">Booking Management</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* LEFT: Upcoming */}
            <div className="lg:col-span-3 space-y-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3 h-3" /> Live Tickets
              </p>
              <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x">
                {upcomingSessions.length > 0 ? (
                  upcomingSessions.map((res) => (
                    <div key={res.id} className="snap-start flex-shrink-0 w-80 group">
                      <div className="relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-indigo-100/50 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                          <span className="text-[10px] font-black tracking-widest uppercase">Upcoming</span>
                          <span className="text-[10px] font-bold flex items-center gap-1"> 
                            <Calendar className="w-3 h-3" /> {new Date(res.availableDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="p-8">
                          <div className="flex justify-between items-end mb-6">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Start</p>
                              <p className="text-2xl font-black text-slate-800">{res.startTime}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">End</p>
                              <p className="text-2xl font-black text-indigo-600">{res.endTime}</p>
                            </div>
                          </div>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <button className="w-full py-4 bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
                                See Details
                              </button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[3rem] bg-white border-none shadow-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Session with {res.mentor.firstname}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 space-y-4">
                                 <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                                    <p className="text-xs text-slate-400 font-bold uppercase mb-2">Mentor Session</p>
                                    <p className="text-lg font-bold text-slate-800">
                                      {new Date(res.availableDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <p className="text-indigo-600 font-black text-xl mt-1">
                                      {res.startTime} — {res.endTime}
                                    </p>
                                 </div>
                                 {res.mentor.profileLink && (
                                   <a href={res.mentor.profileLink} target="_blank" className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl text-indigo-700 text-sm font-bold">
                                      Join via {res.mentor.socialPlatform || 'Meeting Link'}
                                      <ExternalLink className="w-4 h-4" />
                                   </a>
                                 )}
                                 <div className="flex gap-3">
                                    <button className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-colors">Confirm Attendance</button>
                                    <button className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-colors">Reschedule</button>
                                 </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-[2.5rem]">
                    <p className="text-slate-400 text-sm font-medium">No upcoming sessions. Time to book one!</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: History */}
            <div className="space-y-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3 h-3" /> Past Sessions
              </p>
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm h-[320px] overflow-y-auto custom-scrollbar">
                {pastSessions.length > 0 ? (
                  <div className="space-y-4">
                    {pastSessions.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100">
                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-slate-800 leading-tight">{item.mentor.firstname}</p>
                          <p className="text-[10px] text-slate-400 font-bold">
                            {new Date(item.availableDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-40">
                    <p className="text-xs font-bold text-slate-400 italic">No history yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* MENTORS CAROUSEL */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Expert Mentors</h2>
            <button className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
              View all <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {mentors?.map((ment) => (
                <CarouselItem key={ment.id} className="pl-4 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div onClick={() => push(`/student/mentorProfile/${ment.id}`)} className="group relative pt-12 cursor-pointer">
                    <div className="bg-white rounded-[3rem] p-8 pt-16 text-center border border-slate-100 shadow-lg shadow-slate-200/50 transition-all hover:shadow-indigo-100 hover:-translate-y-2">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2">
                         <div className="relative">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500" />
                            <img 
                              src={ment?.profilePic || `https://ui-avatars.com/api/?name=${ment.firstname}&background=6366f1&color=fff`} 
                              className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" 
                              alt={ment.firstname}
                            />
                         </div>
                      </div>
                      <h3 className="font-black text-xl text-slate-900 tracking-tight">{ment.firstname}</h3>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-2">Specialist</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </section>

        {/* TOP CLUBS */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">🏆 Trending Communities</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedClubs.map((club) => (
              <div
                key={club.id}
                className="group bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                    <Users className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">
                    {club.name}
                  </h3>
                  <p className="text-sm text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                    {club.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-8">
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    {club.clubToStudents.length} members
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-6 py-2.5 text-xs font-black rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-all active:scale-95 shadow-md"
                    >
                      Join Club
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;