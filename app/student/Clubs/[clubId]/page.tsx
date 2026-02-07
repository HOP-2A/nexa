"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ClubType = {
  clubToStudents: {
    clubId: string;
    id: string;
    Student: {
      clerkId: string;
      email: string;
      firstname: string;
      id: string;
      lastname: string;
      phone: string;
      profilePic: string;
    };
  }[];
  code: string;
  id: string;
  name: string;
  presidentId: string;
  createdAt: string;
  description: string;
  events: {
    capacity: number;
    clubId: string;
    createdAt: string;
    description: string;
    endingAt: Date;
    startingAt: Date;
    eventId: string;
    location: string;
    onlineLink: string;
    title: string;
    status: string;
  }[];
};

const Page = () => {
  const params = useParams();
  const clubId = params.clubId as string;
  const [club, setClub] = useState<ClubType | null>(null);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    if (!clubId || !user) return;
    const fetchData = async () => {
      const res = await fetch(`/api/club-management/bring-club-info/${clubId}`);

      if (res.ok) {
        const data = await res.json();
        setClub(data);
      } else {
        toast.error("Something went wrong");
      }
    };
    fetchData();
  }, [isLoaded, user, clubId]);

  const formatEventDate = (eventDate: string) => {
    const d = new Date(eventDate);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, "0");
    const day = String(d.getUTCDate()).padStart(2, "0");
    const hours = String(d.getUTCHours()).padStart(2, "0");
    const minutes = String(d.getUTCMinutes()).padStart(2, "0");
    return `${year}/${month}/${day} 🕒 ${hours}:${minutes}`;
  };
  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Club Header */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {club?.name}
              </h1>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full
                     bg-blue-100 text-blue-700 text-xs font-medium shadow-sm select-none"
              aria-label="Club Member Badge"
            >
              Member
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            {club?.description || "No description provided."}
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Members</p>
              <p className="text-lg font-semibold text-gray-900">
                {club?.clubToStudents?.length || 0}
              </p>
            </div>

            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-semibold text-blue-600">Member</p>
            </div>

            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-semibold text-green-600">Active</p>
            </div>
          </div>
        </section>

        {/* Members */}
        <section className="mt-6 bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Members</h2>

          <div className="max-h-64 overflow-y-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {club?.clubToStudents?.map((el, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-blue-50 rounded-md"
                >
                  <div className="relative rounded-full border-2 border-blue-400 p-0.5">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={
                          el?.Student?.profilePic ||
                          "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback>
                        {el?.Student?.firstname?.[0] || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div className="text-sm font-medium text-gray-900">
                    {el?.Student?.firstname || "-"}{" "}
                    <span className="text-gray-500 font-normal">
                      {el?.Student?.clerkId === user?.id
                        ? "You"
                        : el?.Student?.lastname || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Events Overview */}
        <section className="mt-6">
          <div className="py-3 px-6 bg-white rounded-lg shadow-sm w-full sm:w-fit">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-500 text-sm font-semibold">
                Events Overview
              </div>
            </div>

            <div className="flex space-x-4 mb-3 border-b border-gray-200">
              <button className="pb-1 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
                Upcoming
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {club?.events
                ?.filter((event) => event.status === "NEW")
                .map((event) => (
                  <div
                    key={event.eventId}
                    className="p-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="font-semibold text-gray-900 text-sm">
                      {event.title}
                    </div>

                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 mt-1">
                      {event.location && (
                        <span className="flex items-center gap-1">
                          📍 <span>{event.location}</span>
                        </span>
                      )}
                      {event.startingAt && (
                        <span className="flex items-center gap-1">
                          📅{" "}
                          <span>
                            {formatEventDate(event.startingAt.toString())}
                          </span>
                        </span>
                      )}
                    </div>

                    {event.description && (
                      <div className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {event.description}
                      </div>
                    )}
                  </div>
                ))}

              {!club?.events?.some((event) => event.status === "NEW") && (
                <div className="text-gray-400 text-sm">No upcoming events</div>
              )}
            </div>
          </div>
        </section>
        <section className="mt-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 max-w-sm">
            <p className="text-sm text-gray-600 leading-relaxed">
              Club events and announcements are managed by the president. You’ll
              be notified when new updates are available.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
