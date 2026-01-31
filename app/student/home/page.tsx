"use client";

import { useUser } from "@clerk/nextjs";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

type StudentType = {
  clerkId: string;
  email: string;
  createdAt: string;
  firstname: string;
  id: string;
  lastname: string;
  phone: string;
  profilePic: string;
  clubToStudents: {
    clubId: string;
    Club: {
      code: string;
      createdAt: string;
      description: string;
      id: string;
      name: string;
      presidentId: string;
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
  }[];
};

type ClubsType = {
  clubId: string;
  Club: {
    code: string;
    createdAt: string;
    description: string;
    id: string;
    name: string;
    presidentId: string;
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
};

const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [student, setStudent] = useState<StudentType | null>(null);
  const [clubs, setClubs] = useState<ClubsType[] | null | undefined>(null);
  const { push } = useRouter();
  const [inputs, setInputs] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!isLoaded || !user) return;
    const fetchStudentInfo = async () => {
      try {
        const res = await fetch(`/api/student/info/${user.id}`);
        if (!res.ok) throw new Error("Failed to fetch student info");
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStudentInfo();
  }, [isLoaded, user]);

  useEffect(() => {
    if (!student) return;
    setClubs(student.clubToStudents ?? null);
  }, [student]);

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>You are not signed in</div>;

  const CreateClub = async () => {
    const res = await fetch("/api/student/create-club", {
      method: "POST",
      body: JSON.stringify({
        president: student?.id,
        name: inputs.name,
        description: inputs.description,
      }),
    });

    if (res.ok) {
      toast.success("Successfully created club!");
    } else {
      toast.error("Something went wrong");
    }
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="bg-blue-50 min-h-screen px-4 sm:px-6 md:px-10 lg:px-20 py-8">
      <section className="flex flex-col space-y-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900">My Clubs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs?.map((club) => (
            <div
              onClick={() => {
                club?.Club?.presidentId === student?.id
                  ? push(`/student/presidentClubs/${club?.Club?.id}`)
                  : push(`/student/Clubs/${club?.Club?.id}`);
              }}
              key={club.Club?.id}
              className="p-5 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-semibold mb-2">{club?.Club?.name}</h3>
              <p className="text-gray-700 mb-4">{club?.Club?.description}</p>
              <div
                className={`text-sm font-semibold ${
                  club?.Club.presidentId === student?.id
                    ? "text-green-600"
                    : "text-blue-600"
                }`}
              >
                Status:{" "}
                {club?.Club.presidentId === student?.id
                  ? "President"
                  : "Member"}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-gray-500 text-sm">Clubs Joined</div>
            <div className="text-xl font-bold">
              {student?.clubToStudents.length}
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-gray-500 text-sm">President Roles</div>
            <div className="text-xl font-bold">
              {
                student?.clubToStudents.filter(
                  (c) => c?.Club?.presidentId === student.id,
                ).length
              }
            </div>
          </div>
          <Dialog>
            <DialogTrigger>
              <div className="flex-1 min-w-[120px] p-4 bg-blue-100 rounded-lg shadow-sm text-center cursor-pointer hover:bg-blue-200 transition">
                <div className="text-blue-700 font-semibold text-sm mb-2">
                  + Create New Club
                </div>
                <div className="text-blue-900 font-bold text-xl">Action</div>
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md w-full">
              <DialogHeader>
                <DialogTitle>Create New Club</DialogTitle>
                <DialogDescription>
                  Fill in the details below to create your new club.
                </DialogDescription>
              </DialogHeader>

              <form className="mt-4 space-y-4">
                <div>
                  <label className="block text-gray-700 text-sm mb-1">
                    Club Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter club name"
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={inputs.name}
                    name="name"
                    onChange={(e) => {
                      handleInput(e);
                    }}
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
                    onChange={(e) => {
                      handleInput(e);
                    }}
                  />
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
                      CreateClub();
                    }}
                  >
                    Create
                  </button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="py-3 px-6 pl-6 pr-7 bg-white rounded-lg shadow-sm w-fit">
          <div className="text-gray-500 text-sm mb-2 font-semibold">
            Events Overview
          </div>
          <div className="flex space-x-4 mb-3 border-b border-gray-200">
            <button className="pb-1 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
              Upcoming
            </button>
          </div>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {student?.clubToStudents
              .flatMap((club) =>
                (club.Club?.events || []).map((event) => ({
                  ...event,
                  clubName: club?.Club.name,
                })),
              )
              .filter((event) => event.status === "NEW")
              .map((event) => (
                <div key={event.eventId} className="text-sm text-gray-700">
                  <div className="font-semibold">{event.title}</div>
                  <div className="text-gray-500">
                    {event.clubName} •{" "}
                    {new Date(event.startingAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Page;
