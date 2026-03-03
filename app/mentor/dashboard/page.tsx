"use client";

import MentorSideBar from "@/app/_component/mentorSideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
      cache: "no-store",
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] overflow-hidden font-sans">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/40 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-sky-200/40 blur-[100px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[40%] rounded-full bg-violet-200/30 blur-[120px]" />
      </div>

      <MentorSideBar
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/account")}
      />

      <main className="flex-1 relative z-10 flex flex-col p-6 md:p-10 gap-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
              Expert{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                Console
              </span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Empowering the next generation of talent.
            </p>
          </div>

          <button
            onClick={() => push("/mentor/dashboard/createCourse")}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-2xl hover:bg-indigo-700 focus:outline-none shadow-[0_10px_20px_-10px_rgba(79,70,229,0.6)]"
          >
            <span className="mr-2 text-xl">+</span> New Course
          </button>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => push("/mentor/reservation")}
                className="cursor-pointer group p-8 rounded-[32px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Student Reservations
                </h3>
                <p className="text-slate-500 text-sm mt-2">
                  Manage your upcoming bookings and student meetings.
                </p>
              </div>

              <div className="p-8 rounded-[32px] bg-white/60 backdrop-blur-xl border border-white/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Course Analytics
                </h3>
                <p className="text-slate-500 text-sm mt-2">
                  Track performance and engagement across your content.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[40px] p-10 bg-slate-900 text-white shadow-2xl">
              <div className="relative z-10">
                <span className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 uppercase tracking-widest">
                  Growth Tip
                </span>
                <h2 className="text-3xl font-bold mt-6 mb-4">
                  Host a Live Workshop
                </h2>
                <p className="text-slate-400 max-w-md leading-relaxed mb-8">
                  Increase your student engagement by 40% by hosting a live Q&A
                  session this week.
                </p>
                <button className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
                  Schedule Now
                </button>
              </div>

              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[80px] -mr-20 -mt-20" />
              <div className="absolute bottom-0 right-20 w-32 h-32 bg-violet-500/20 rounded-full blur-[60px]" />
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center justify-between">
                Active Courses
                <span className="text-xs bg-slate-200 text-slate-600 px-2.5 py-1 rounded-lg font-bold">
                  {courses.length}
                </span>
              </h3>

              <div className="space-y-3">
                {courses.map((course) => (
                  <button
                    key={course.id}
                    onClick={() =>
                      push(`/mentor/dashboard/courseDates/${course.id}`)
                    }
                    className="w-full group flex items-center gap-4 p-4 rounded-2xl bg-white/50 border border-transparent hover:border-indigo-200 hover:bg-white hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 flex items-center justify-center font-bold text-indigo-600 group-hover:scale-110 transition-transform">
                      {course.courseTitle?.charAt(0) ?? "C"}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-slate-700 group-hover:text-indigo-600 transition-colors truncate">
                        {course.courseTitle}
                      </p>
                      <p className="text-xs text-slate-400">
                        Manage dates &amp; curriculum
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
