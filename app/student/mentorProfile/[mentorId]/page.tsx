"use client";

import * as React from "react";
import SideBar from "@/app/_component/sideBar";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Mentor = {
  id: string;
  firstname: string;
  lastname: string;
  bio: string | null;
  profilePic: string | null;
};

type Course = {
  id: string;
  courseTitle: string;
};

const FALLBACK_AVATAR =
  "data:image/png;base64,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";

const Page = () => {
  const { push } = useRouter();
  const params = useParams<{ mentorId: string }>();
  const mentorId = params.mentorId;

  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  const fetchMentor = useCallback(async () => {
    const res = await fetch(`/api/mentor/findSingleMentor/${mentorId}`, {
      method: "GET",
    });
    if (!res.ok) {
      setMentor(null);
      return;
    }
    const data: Mentor = await res.json();
    setMentor(data ?? null);
  }, [mentorId]);

  const fetchCourses = useCallback(async () => {
    const res = await fetch(`/api/course/findSpecificCourse/${mentorId}`, {
      method: "GET",
    });
    if (!res.ok) {
      setCourses([]);
      return;
    }
    const data: Course[] = await res.json();
    setCourses(Array.isArray(data) ? data : []);
  }, [mentorId]);

  useEffect(() => {
    fetchMentor();
    fetchCourses();
  }, [fetchMentor, fetchCourses]);

  const mentorImageSrc = useMemo(() => {
    if (!mentor) return FALLBACK_AVATAR;
    return mentor.profilePic ?? FALLBACK_AVATAR;
  }, [mentor]);

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />

      <div className="flex-1">
        <main className="p-4 md:p-8">
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <img
              src={mentorImageSrc}
              alt={mentor ? `${mentor.firstname} ${mentor.lastname}` : "Mentor"}
              className="w-28 h-28 rounded-2xl object-cover mb-4"
            />

            <h1 className="text-2xl font-semibold text-slate-800">
              {mentor ? `${mentor.firstname} ${mentor.lastname}` : "Loading..."}
            </h1>

            {mentor?.bio ? (
              <p className="text-slate-500 mt-2">{mentor.bio}</p>
            ) : (
              <p className="text-slate-500 mt-2">
                This person is lazy, have not written a bio...
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">
              Courses Offered
            </h2>

            {courses.length === 0 ? (
              <p className="text-slate-500">No courses found.</p>
            ) : (
              <Carousel className="w-full">
                <CarouselContent>
                  {courses.map((cs) => (
                    <CarouselItem
                      key={cs.id}
                      className="basis-[85%] sm:basis-1/2 lg:basis-1/3 p-2"
                    >
                      <div
                        onClick={() =>
                          push(`/student/mentorProfile/${mentorId}/${cs.id}`)
                        }
                        className="border rounded-xl px-4 py-4 bg-slate-100 hover:bg-slate-200 transition cursor-pointer h-full"
                      >
                        <span className="font-medium text-slate-800">
                          {cs.courseTitle}
                        </span>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
