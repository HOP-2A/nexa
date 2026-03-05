"use client";

import SideBar from "@/app/_component/sideBar";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarIcon, CheckCircle, ChevronRight, Clock, ShieldCheck, Star, Zap } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/app/provider/authProvider";
import { Button } from "@/components/ui/button";

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

  const courseId = params.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [availableDate, setAvailableDate] = useState<AvailableDate[]>([]);
  const [date, setDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id) as { user: AuthUser };
  const studentId = useMemo(() => user?.id ?? null, [user]);

  const fetchCourse = useCallback(async () => {
    const res = await fetch(`/api/course/findOne/${courseId}`, {
      method: "GET",
    });

    if (!res.ok) {
      setCourse(null);
      return;
    }

    const response: Course = await res.json();
    setCourse(response ?? null);
  }, [courseId]);

  const fetchDates = useCallback(async () => {
    const res = await fetch("/api/mentorAvailability/mentorsDates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        date,
      }),
    });

    if (!res.ok) {
      setAvailableDate([]);
      return;
    }

    const response: AvailableDate[] = await res.json();
    setAvailableDate(Array.isArray(response) ? response : []);
  }, [courseId, date]);

  useEffect(() => {
    fetchCourse();
    fetchDates();
  }, [fetchCourse, fetchDates]);

  const handleBooking = useCallback(
    async (id: AvailableDate["id"]) => {
      if (!studentId) return;

      await fetch("/api/mentorAvailability/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          studentId,
        }),
      });

      await fetchDates();
    },
    [studentId, fetchDates],
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] md:flex font-sans text-slate-900">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />
  
      <div className="flex-1 flex flex-col h-screen overflow-y-auto custom-scrollbar">
        {/* 1. MINIMAL BREADCRUMB */}
        <header className="px-8 py-6 sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            <span className="cursor-pointer hover:text-indigo-600 transition-colors">Dashboard</span>
            <ChevronRight size={12} className="mx-3 text-slate-300" />
            <span className="text-indigo-600">Course Workspace</span>
          </div>
        </header>
  
        <main className="p-6 md:p-10 max-w-[1600px] mx-auto w-full">
          
          {/* 2. DYNAMIC GRID LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT COLUMN: RESERVATION ENGINE (7/12) */}
            <div className="lg:col-span-7 space-y-10">
              <header className="space-y-2">
                <h2 className="text-4xl font-black tracking-tighter text-slate-900">
                  Pick your <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Moment.</span>
                </h2>
                <p className="text-slate-500 font-medium">Select a date and time that fits your schedule.</p>
              </header>
  
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Modern Calendar Card */}
                <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-50">
                  <div className="flex items-center gap-3 mb-4 px-2">
                    <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600">
                      <CalendarIcon size={18} />
                    </div>
                    <span className="font-bold text-slate-700">Calendar</span>
                  </div>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="p-0 pointer-events-auto"
                    disabled={(d) => d < today}
                  />
                </div>
  
                {/* Time Slots Grid */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">Available Slots</p>
                  <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {availableDate.filter(s => s.status === "AVAILABLE").length > 0 ? (
                      availableDate.map((slot) => (
                        slot.status === "AVAILABLE" && (
                          <Dialog key={slot.id}>
                            <DialogTrigger asChild>
                              <button className="group relative flex items-center justify-between p-5 bg-white border border-slate-100 rounded-3xl hover:border-indigo-500 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300 text-left">
                                <div className="flex items-center gap-4">
                                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <Clock size={20} />
                                  </div>
                                  <div>
                                    <p className="text-sm font-black text-slate-800">{slot.startTime}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">{slot.endTime}</p>
                                  </div>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                  <ChevronRight size={16} className="text-indigo-600" />
                                </div>
                              </button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2.5rem] border-none">
                              <DialogHeader>
                                <DialogTitle className="text-2xl font-black">Confirm Booking</DialogTitle>
                                <p className="text-slate-500 text-sm">You are booking a session for {date?.toLocaleDateString()}.</p>
                              </DialogHeader>
                              <div className="mt-4 p-6 bg-indigo-600 rounded-3xl text-white text-center">
                                 <p className="text-xs font-bold uppercase opacity-80 mb-1">Session Time</p>
                                 <p className="text-xl font-black">{slot.startTime} — {slot.endTime}</p>
                              </div>
                              <Button 
                                className="mt-4 h-14 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold"
                                onClick={() => handleBooking(slot.id)}
                              >
                                Finalize Reservation
                              </Button>
                            </DialogContent>
                          </Dialog>
                        )
                      ))
                    ) : (
                      <div className="p-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-sm text-slate-400 font-medium">No slots available for this date.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
  
            {/* RIGHT COLUMN: COURSE INFO (5/12) */}
            <div className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                
                {/* The Hero Card */}
                <div className="relative overflow-hidden rounded-[3rem] bg-indigo-600 text-white shadow-2xl shadow-indigo-200 p-10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black uppercase tracking-wider">
                      <Star size={10} className="fill-yellow-400 text-yellow-400" /> Premium
                    </div>
  
                    <h1 className="text-4xl font-black leading-tight tracking-tighter">
                      {course?.courseTitle || "Course Loading..."}
                    </h1>
  
                    <div className="flex items-end justify-between pt-6 border-t border-white/10">
                      <div>
                        <p className="text-[10px] font-bold uppercase opacity-60">Investment</p>
                        <p className="text-3xl font-black">{course?.paymentValue ?? "—"}</p>
                      </div>
                      <div className="h-12 w-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                        <Zap size={20} />
                      </div>
                    </div>
                  </div>
                </div>
  
                {/* About Course Section */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <div className="w-2 h-6 bg-indigo-600 rounded-full" />
                    Experience Details
                  </h3>
  
                  <div className="text-slate-500 text-sm leading-relaxed space-y-4">
                    {course?.courseInfo ? (
                      <p>{course.courseInfo}</p>
                    ) : (
                      <p className="italic text-slate-400">Loading curriculum details...</p>
                    )}
                  </div>
  
                  <div className="grid grid-cols-1 gap-3">
                    {["60min Mentorship", "Full Resource Access", "Certificate of Completion"].map((item) => (
                      <div key={item} className="flex items-center gap-3 text-xs font-bold text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <CheckCircle size={16} className="text-emerald-500" />
                        {item}
                      </div>
                    ))}
                  </div>
  
                  <div className="pt-4 flex items-center justify-center gap-6 border-t border-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1"><ShieldCheck size={14}/> Secure</span>
                    <span className="flex items-center gap-1"><Star size={14}/> Top Rated</span>
                  </div>
                </div>
              </div>
            </div>
  
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
