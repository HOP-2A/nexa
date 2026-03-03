"use client";

import SideBar from "@/app/_component/sideBar";
import { useParams, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle, ChevronRight, Star } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
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
    <div className="min-h-screen bg-slate-50 md:flex font-sans text-slate-900">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />

      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center text-sm text-slate-500">
            <span className="cursor-pointer hover:text-indigo-600">
              Dashboard
            </span>
            <ChevronRight size={16} className="mx-2" />
            <span className="font-medium text-slate-900">Course Details</span>
          </div>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="relative overflow-hidden rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-200">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-indigo-400 opacity-20 blur-2xl"></div>

            <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/50 border border-indigo-400 text-xs font-semibold tracking-wide uppercase">
                    <Star
                      size={12}
                      className="text-yellow-300 fill-yellow-300"
                    />
                    Premium Course
                  </div>

                  <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                    {course?.courseTitle || "Course Title Loading..."}
                  </h1>
                </div>

                <div className="hidden md:block text-right">
                  <p className="text-indigo-200 text-sm mb-1">Total Value</p>
                  <p className="text-4xl font-bold">
                    {course?.paymentValue ?? "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  About this Course
                </h2>

                <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                  {course?.courseInfo ? (
                    <p>{course.courseInfo}</p>
                  ) : (
                    <p className="italic text-slate-400">
                      No course information available.
                    </p>
                  )}
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["1hour", "Mentor Support"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg"
                    >
                      <CheckCircle size={18} className="text-emerald-500" />
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100 sticky top-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="p-0"
                      disabled={(d) => d < today}
                    />
                  </CardContent>

                  {availableDate.map((slot) =>
                    slot.status === "AVAILABLE" ? (
                      <Dialog key={slot.id}>
                        <div className="bg-white border rounded-3xl p-5 shadow-sm">
                          <div className="mb-3">
                            <p>{slot.startTime}</p>
                            <p>{slot.endTime}</p>
                          </div>

                          <DialogTrigger asChild>
                            <Button variant="default" type="button">
                              Book Now
                            </Button>
                          </DialogTrigger>
                        </div>

                        <DialogContent>
                          <DialogTitle>Confirm Booking</DialogTitle>
                          <Button
                            type="button"
                            onClick={() => handleBooking(slot.id)}
                          >
                            Confirm
                          </Button>
                        </DialogContent>
                      </Dialog>
                    ) : null,
                  )}
                </div>

                <p className="text-xs text-center text-slate-400 mt-4">
                  30-day money-back guarantee • Secure checkout
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
