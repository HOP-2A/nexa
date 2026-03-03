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

type AuthUser = { id: string } | null;

type Mentor = {
  id: string;
  firstname: string;
  profilePic: string | null;
};

type StudentBookedReservation = {
  startTime: string;
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

const FALLBACK_AVATAR =
  "data:image/png;base64,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";

const Page = () => {
  const { push } = useRouter();
  const { user: clerkUser } = useUser();

  const [mentors, setMentor] = useState<Mentor[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [studentBooked, setStudentBooked] = useState<
    StudentBookedReservation[]
  >([]);

  const { user } = useAuth(clerkUser?.id) as { user: AuthUser };
  const studentId = useMemo(() => user?.id ?? null, [user]);

  const findAllmentors = useCallback(async () => {
    const res = await fetch("/api/mentor/findAllMentor", { method: "GET" });
    if (!res.ok) {
      setMentor([]);
      return;
    }
    const data: Mentor[] = await res.json();
    setMentor(Array.isArray(data) ? data : []);
  }, []);

  const fetchAllClubs = useCallback(async () => {
    const res = await fetch("/api/clubToStudents/allClubs", { method: "GET" });
    if (!res.ok) {
      setClubs([]);
      return;
    }
    const data: Club[] = await res.json();
    setClubs(Array.isArray(data) ? data : []);
  }, []);

  const fetchBooked = useCallback(async () => {
    if (!studentId) return;

    const res = await fetch("/api/mentorAvailability/studentBooked", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });

    if (!res.ok) {
      setStudentBooked([]);
      return;
    }

    const data: StudentBookedReservation[] = await res.json();
    setStudentBooked(Array.isArray(data) ? data : []);
  }, [studentId]);

  useEffect(() => {
    findAllmentors();
    fetchAllClubs();
    fetchBooked();

    if (clerkUser?.publicMetadata?.role === "MENTOR") {
      push("/mentor/dashboard");
    }
  }, [
    findAllmentors,
    fetchAllClubs,
    fetchBooked,
    clerkUser?.publicMetadata?.role,
    push,
  ]);

  const sortedClubs = useMemo(() => {
    return [...clubs].sort(
      (a, b) =>
        (b.clubToStudents?.length ?? 0) - (a.clubToStudents?.length ?? 0),
    );
  }, [clubs]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />
  
      <main className="flex-1 p-8 lg:p-12 space-y-16 overflow-x-hidden">
        
        {/* 1. HERO HEADER */}
        <header className="relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -z-10" />
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
            Student Hub
          </h1>
        </header>
  
        {/* 2. RESERVATIONS & HISTORY SECTION */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Booking Management</h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT: Active Reservations */}
            <div className="flex-1 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Tickets</p>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {studentBooked.map((res, i) => (
                  <div key={i} className="snap-center flex-shrink-0 w-80 group">
                    <div className="relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 transition-all duration-500 group-hover:-translate-y-1">
                      <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-80">Upcoming</span>
                        <span className="text-[10px] font-bold"> {new Date(res.availableDate).toLocaleDateString()}</span>
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
                            <button className="w-full py-3 bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100">
                              See Details
                            </button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[3rem] bg-white/95 backdrop-blur-2xl p-8 border-none">
                            <DialogHeader><DialogTitle className="text-2xl font-black">Booking Details</DialogTitle></DialogHeader>
                            <div className="mt-4 space-y-4">
                               <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                                  <p className="text-xs text-slate-400 font-bold uppercase mb-2">Mentor Session</p>
                                  <p className="text-lg font-bold text-slate-800">
                                    {new Date(res.availableDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                  </p>
                                  <p className="text-indigo-600 font-black text-xl mt-1">
                                    {res.startTime} — {res.endTime}
                                  </p>
                               </div>
                               <div className="flex gap-3">
                                  <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors">Join Meeting</button>
                                  <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors">Cancel</button>
                               </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* RIGHT: History Column */}
            <div className="w-full lg:w-72 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session History</p>
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm max-h-[280px] overflow-y-auto custom-scrollbar">
                {studentBooked.length > 0 ? (
                  <div className="space-y-6">
                    {studentBooked.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Session Done</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {new Date(item.availableDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-10 italic">No history yet.</p>
                )}
              </div>
            </div>
  
          </div>
        </section>
  
        {/* 3. MENTORS */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">Expert Mentors</h2>
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {mentors?.map((ment) => (
                <CarouselItem key={ment.id} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div onClick={() => push(`/student/mentorProfile/${ment.id}`)} className="group relative pt-10 cursor-pointer">
                    <div className="bg-white rounded-[3rem] p-10 pt-16 text-center border border-slate-100 shadow-lg transition-all hover:-translate-y-2">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2">
                         <div className="relative">
                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500" />
                            <img src={ment?.profilePic || `https://ui-avatars.com/api/?name=${ment.firstname}&background=6366f1&color=fff`} className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" />
                         </div>
                      </div>
                      <h3 className="font-black text-xl text-slate-900 tracking-tight">{ment.firstname}</h3>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2">Specialist</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              🏆 Top Clubs
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedClubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-slate-800">
                  {club.name}
                </h3>

                <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                  {club.description}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-600">
                    👥 {club.clubToStudents.length} members
                  </span>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm rounded-xl bg-slate-100 hover:bg-slate-200 transition"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
                    >
                      Join
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
