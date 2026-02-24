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

type Invite = {
  id: string;
  studentEmail: string;
  inviterId: string;
  code: string;
  Student: {
    clerkId: string;
    email: string;
    firstname: string;
    id: string;
    lastname: string;
    phone: string;
    profilePic: string;
    clubToStudents: {
      id: string;
      Club: {
        code: string;
        id: string;
        name: string;
        presidentId: string;
      };
    }[];
  };
};

type NewClubType = {
  id: string;
  code: string;
  description: string;
  name: string;
  presidentId: string;
  clubToStudents: {
    id: true;
    studentId: true;
  }[];
};

const Page = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [newClubs, setNewClubs] = useState<NewClubType[] | []>([]);
  const [student, setStudent] = useState<StudentType | null>(null);
  const [clubs, setClubs] = useState<ClubsType[] | null | undefined>(null);
  const [invites, setInvites] = useState<Invite[] | []>([]);
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
    if (!student?.id) return;

    const fetchInvites = async () => {
      try {
        const res = await fetch(`/api/student/invites/${student.id}`);
        if (!res.ok) throw new Error("Failed to fetch invites");
        const data = await res.json();
        setInvites(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchInvites();
  }, [student?.id]);

  useEffect(() => {
    if (!student?.id) return;

    const fetchNewClubs = async () => {
      try {
        const res = await fetch(`/api/club-management/clubs/${student.id}`);
        if (!res.ok) throw new Error("Failed to fetch invites");
        const data = await res.json();
        setNewClubs(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNewClubs();
  }, [student?.id]);

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

  const Reject = async (inviteId: string) => {
    const res = await fetch(`/api/club-management/invite-reject/${inviteId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      toast.success("Successfully Rejected the invite");
    } else {
      toast.error("Somethibg went wrong, reject again hha");
    }
  };

  const Accept = async (clubId: string, inviteId: string) => {
    const res = await fetch("/api/club-management/invite-accept", {
      method: "POST",
      body: JSON.stringify({
        studentId: student?.id,
        clubId: clubId,
        inviteId: inviteId,
      }),
    });

    if (res.ok) {
      toast.success("Successfully entered the club");
    } else {
      toast.error("Something went wrong");
    }
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

          <div className="p-4 bg-white rounded-lg shadow-sm">
            <div className="text-gray-500 text-sm">Invites Inbox</div>
            <div className="text-xl font-bold">{invites?.length}</div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
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
          <div className="rounded-lg bg-white shadow-sm w-full md:w-1/3 max-h-[200px] overflow-y-auto p-6 space-y-4">
            <h2 className="text-lg font-semibold">Invites overview</h2>

            {invites?.map((invite) => {
              const student = invite?.Student;

              const matchingClub = student?.clubToStudents?.find(
                (club) =>
                  club?.Club?.presidentId === student?.id &&
                  club?.Club?.code === invite?.code,
              );

              return (
                <div
                  key={invite.id}
                  className="border rounded-md p-4 space-y-1 text-sm"
                >
                  <div>
                    <span className="font-medium">Code:</span> {invite.code}
                  </div>

                  <div>
                    <span className="font-medium">Inviter:</span>{" "}
                    {student?.firstname} {student?.lastname}
                  </div>

                  <div>
                    <span className="font-medium">Inviter email:</span>{" "}
                    {student?.email}
                  </div>

                  <div>
                    <span className="font-medium">Club name:</span>{" "}
                    {matchingClub ? (
                      <span>{matchingClub.Club?.name}</span>
                    ) : (
                      <span className="text-red-500">
                        Unknown club, please contact the inviter
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        Reject(invite.id);
                      }}
                      className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-100 transition"
                    >
                      Reject
                    </button>

                    <button
                      onClick={() => {
                        Accept(matchingClub?.Club?.id!, invite?.id);
                      }}
                      className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-900 hover:text-white transition"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Join New Clubs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {newClubs?.map((club) => (
              <div
                key={club?.id}
                onClick={() => push(`/student/clubForm/${club?.id}`)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {club?.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                    {club?.description}
                  </p>

                  <div className="flex items-center justify-between mt-5">
                    <div
                      className="px-3 py-1 text-sm font-medium 
                          bg-blue-50 text-blue-600 
                          rounded-full"
                    >
                      👥 {club?.clubToStudents?.length} Members
                    </div>
                    <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
                      →
                    </span>
                  </div>
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
