"use client";

import { Mentor } from "@prisma/client";
import { useState, useEffect } from "react";
import Image from "next/image";

const Page = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);

  useEffect(() => {
    const fetchMentors = async () => {
      const res = await fetch("/api/mentorGet");
      if (!res.ok) throw new Error("Failed to fetch mentors");
      const data = await res.json();
      setMentors(data);
    };

    fetchMentors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-800">
        List of Mentors
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex flex-col items-center rounded-xl bg-white p-6 shadow-md transition hover:shadow-lg"
          >
            
            <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border">
              <Image
                src={mentor.profilePic || "/default-avatar.svg"}
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
            <div>
              {mentor.rating}
            </div>
            <div>
              {mentor.bio}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
