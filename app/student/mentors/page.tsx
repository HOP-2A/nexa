"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">List of Mentors</h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentors.map((mentor) => (
          <button
            key={mentor.id}
            type="button"
            className="flex flex-col items-center rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg text-left"
            onClick={() => push(`/student/mentorProfile/${mentor.id}`)}
          >
            <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border">
              <Image
                src={mentor.profilePic ?? "/default-avatar.svg"}
                alt={`${mentor.firstname} ${mentor.lastname}`}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                {mentor.firstname} {mentor.lastname}
              </p>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Rating: {mentor.rating ?? "—"}
            </div>

            <div className="mt-2 text-sm text-gray-600 line-clamp-3 text-center">
              {mentor.bio ?? "No bio yet."}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Page;
