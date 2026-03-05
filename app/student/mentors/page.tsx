"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 -z-10"></div>

      {/* Sidebar */}
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />

      {/* Main Content */}
      <main className="flex-1 px-8 py-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Discover Mentors
          </h1>
          <p className="text-gray-500 mt-3">
            Connect with experienced mentors to accelerate your growth.
          </p>
        </div>

        {/* Mentor Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {mentors.map((mentor) => (
            <div
              key={mentor.id}
              onClick={() => push(`/student/mentorProfile/${mentor.id}`)}
              className="group cursor-pointer backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-200"
            >
              {/* Avatar */}
              <div className="relative mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full ring-4 ring-indigo-100 group-hover:ring-indigo-300 transition">
                <Image
                  src={mentor.profilePic || "/default-avatar.svg"}
                  alt={`${mentor.firstname} ${mentor.lastname}`}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Name */}
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  {mentor.firstname} {mentor.lastname}
                </h2>

                {/* Rating Badge */}
               <div className="flex items-center justify-center gap-1 mt-2 text-sm text-gray-600">
  <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.955c.3.921-.755 1.688-1.538 1.118l-3.368-2.448a1 1 0 00-1.175 0l-3.368 2.448c-.783.57-1.838-.197-1.538-1.118l1.287-3.955a1 1 0 00-.364-1.118L2.075 9.382c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.274-3.955z" />
  </svg>
  <span>{mentor.rating ?? "New"}</span>
</div>
    
              </div>

              {/* Bio */}
              <p className="mt-4 text-sm text-gray-600 text-center line-clamp-3">
                {mentor.bio || "Passionate mentor ready to guide you."}
              </p>

              {/* Hover CTA */}
              <div className="mt-6 text-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm font-medium text-indigo-600">
                  View Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Page;