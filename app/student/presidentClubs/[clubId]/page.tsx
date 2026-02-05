"use client";

import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    location: "",
    startingAt: "",
    endingAt: "",
    capacity: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const CreateEvent = async () => {
    const res = await fetch("/api/club-management/create-event", {
      method: "POST",
      body: JSON.stringify({
        clubId: club?.id,
        title: inputs.title,
        description: inputs.description,
        startingAt: inputs.startingAt,
        endingAt: inputs.endingAt,
        location: inputs.location,
        capacity: Number(inputs.capacity),
      }),
    });

    if (res.ok) {
      toast.success("Successfully added event");
    } else {
      toast.error("Something went wrong");
    }
  };

  console.log(inputs);
  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {club?.name}
              </h1>
              <p className="text-sm text-gray-500">
                Opened{" "}
                {club?.createdAt
                  ? new Date(club.createdAt).toLocaleDateString()
                  : "-"}
              </p>
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full
                       bg-blue-600 text-white text-xs font-medium shadow-sm select-none"
              aria-label="Club President Badge"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M6 8l-2 6h12l-2-6-3 3-3-3z" />
                <path d="M2 6l4-4 4 4 4-4 4 4v10H2V6z" />
              </svg>
              President
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            {club?.description || "No description provided."}
          </p>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Members</p>
              <p className="text-lg font-semibold text-gray-900">
                {club ? Number(club?.clubToStudents?.length) - 1 : 0}
              </p>
            </div>

            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Club Code</p>
              <p className="text-sm font-semibold text-blue-700 tracking-wide">
                {club?.code || "---"}
              </p>
            </div>

            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Role</p>
              <p className="text-sm font-semibold text-blue-600">President</p>
            </div>
          </div>
        </section>

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
                      {el?.Student?.lastname || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="py-3 px-6 bg-white rounded-lg shadow-sm w-full sm:w-fit">
            <div className="flex justify-between items-center mb-3">
              <div className="text-gray-500 text-sm font-semibold">
                Events Overview
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 font-semibold text-sm rounded hover:bg-blue-200 transition">
                    ➕ Create Event
                  </button>
                </DialogTrigger>

                <DialogContent className="w-full">
                  <DialogHeader>
                    <DialogTitle>Create New Event</DialogTitle>
                    <DialogDescription>
                      Fill in the details below to create your new event.
                    </DialogDescription>
                  </DialogHeader>

                  <form className="mt-4 space-y-4">
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        placeholder="Enter event title"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.title}
                        name="title"
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">
                        Location
                      </label>
                      <input
                        placeholder="Enter location"
                        className="w-full  border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.location}
                        name="location"
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">
                        Description
                      </label>
                      <input
                        placeholder="Enter description"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.description}
                        name="description"
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm mb-1">
                        Capacity
                      </label>
                      <input
                        placeholder="Enter capacity"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.capacity}
                        name="capacity"
                        onChange={handleInput}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex-1">
                        <label className="block text-gray-700 text-sm mb-1">
                          Start Time
                        </label>
                        <input
                          type="datetime-local"
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={inputs.startingAt}
                          name="startingAt"
                          onChange={handleInput}
                        />
                      </div>

                      <div className="flex-1">
                        <label className="block text-gray-700 text-sm mb-1">
                          End Time
                        </label>
                        <input
                          type="datetime-local"
                          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          value={inputs.endingAt}
                          name="endingAt"
                          onChange={handleInput}
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-2">
                      <DialogClose asChild>
                        <button className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                          Cancel
                        </button>
                      </DialogClose>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          CreateEvent();
                        }}
                      >
                        Create
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
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
                      {" "}
                      {event.location && (
                        <span className="flex items-center gap-1">
                          {" "}
                          📍 <span>{event.location}</span>{" "}
                        </span>
                      )}{" "}
                      {event.startingAt && (
                        <span className="flex items-center gap-1">
                          {" "}
                          📅{" "}
                          <span>
                            {" "}
                            {formatEventDate(
                              (event?.startingAt).toString(),
                            )}{" "}
                          </span>{" "}
                        </span>
                      )}{" "}
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
      </div>
    </div>
  );
};

export default Page;
