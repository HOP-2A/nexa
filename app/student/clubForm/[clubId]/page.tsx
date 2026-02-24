"use client";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

type FormType = {
  age: number;
  class: string;
  clubId: string;
  experience: string;
  id: string;
  message: string;
  personalStatement: string;
  skills: string;
  status: string;
  studentId: string;
  submittedAt: string;
  whyThisClub: string;
};

const Page = () => {
  const params = useParams();
  const clubId = params.clubId as string;
  const [club, setClub] = useState<ClubType | null>(null);
  const [form, setForm] = useState<FormType | null>(null);
  const [inputs, setInputs] = useState({
    age: "",
    class: "",
    personalStatement: "",
    experience: "",
    skills: "",
    why: "",
  });

  const [code, setCode] = useState("");
  const { isLoaded, isSignedIn, user } = useUser();
  const { push } = useRouter();

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCode = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
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

  const JoinByForm = async (clubId: string) => {
    const res = await fetch("/api/club-management/create-form", {
      method: "POST",
      body: JSON.stringify({
        clubId: clubId,
        studentClerk: user?.id,
        age: inputs.age,
        clasS: inputs.class,
        personal: inputs.personalStatement,
        experience: inputs.experience,
        skills: inputs.skills,
        why: inputs.why,
      }),
    });

    if (res.ok) {
      toast.success("Successfully sent form");
    } else {
      toast.error("Something went wrong, please resend");
    }
  };

  useEffect(() => {
    if (!clubId || !user) return;

    const FindInfo = async () => {
      const res = await fetch("/api/student/FindInfo", {
        method: "POST",
        body: JSON.stringify({
          studentClerk: user?.id,
          clubId: club?.id,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setForm(data);
      } else {
        toast.error("Something went wrong");
      }
    };
    FindInfo();
  }, [isLoaded, user, clubId]);

  const JoinByCode = async (clubCode: string, cludId: string) => {
    if (code === clubCode) {
      const res = await fetch("/api/club-management/join", {
        method: "POST",
        body: JSON.stringify({
          studentClerk: user?.id,
          clubId: clubId,
        }),
      });
      if (res.ok) {
        toast.success("Successfully joined");
        push(`/student/Clubs/${clubId}`);
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
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
              Not enrolled
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
              <p className="text-sm font-semibold text-blue-600">
                Not enrolled
              </p>
            </div>

            <div className="bg-[#F0F5FF] border border-gray-100 rounded-md px-4 py-3 text-center">
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-semibold text-green-600">Active</p>
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
        {!form ? (
          <section className="mt-8 bg-gray-100 border border-gray-200 rounded-xl shadow-sm p-6">
            <h4 className="text-xl font-semibold text-gray-800">
              Apply to Enroll
            </h4>
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Join using club code
              </p>

              <div className="flex gap-3">
                <Input
                  placeholder="Enter club code..."
                  className="flex-1 bg-white border-gray-300 focus:ring-blue-400"
                  value={code}
                  onChange={(e) => {
                    handleCode(e);
                  }}
                />
                <Button
                  onClick={() => {
                    JoinByCode(club?.code!, club?.id!);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-5"
                >
                  Join
                </Button>
              </div>
            </div>
            <div className="border-t border-gray-200 my-6"></div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Or submit an application form
              </p>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="w-full bg-white border border-gray-200 rounded-lg p-4 text-left hover:bg-gray-50 transition">
                    <div className="text-sm text-gray-500">
                      Application Required
                    </div>
                    <div className="text-base font-semibold text-gray-800 mt-1">
                      Open Application Form
                    </div>
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md w-full bg-gray-100 border border-gray-200 rounded-xl">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-gray-800">
                      Application Form
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">
                      Fill in the details below to apply for this club.
                    </DialogDescription>
                  </DialogHeader>

                  <form className="mt-5 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Your Class
                      </label>
                      <input
                        type="text"
                        placeholder="Enter class name..."
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.class}
                        name="class"
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Your age
                      </label>
                      <input
                        placeholder="Enter age..."
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.age}
                        name="age"
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Personal statement /150 words maximum/
                      </label>
                      <input
                        placeholder="Enter text..."
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.personalStatement}
                        name="personalStatement"
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Your experience /100 words maximum/
                      </label>
                      <input
                        placeholder="Enter text..."
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.experience}
                        name="experience"
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Your Skills /100 words maximum/
                      </label>
                      <input
                        placeholder="Enter text..."
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.skills}
                        name="skills"
                        onChange={handleInput}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Explain why you want this club /150 words maximum/
                      </label>
                      <input
                        placeholder="Enter text..."
                        className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={inputs.why}
                        name="why"
                        onChange={handleInput}
                      />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <DialogClose asChild>
                        <button className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700">
                          Cancel
                        </button>
                      </DialogClose>

                      <button
                        type="submit"
                        onClick={() => {
                          JoinByForm(club?.id!);
                        }}
                        className="px-4 py-2 text-sm rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </section>
        ) : (
          <section className="w-full max-w-4xl mx-auto bg-white border border-gray-200 rounded-lg p-6 text-sm mt-6">
            <div className="flex flex-col gap-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-200 pb-4">
                <div>
                  <h2 className="text-base font-medium text-gray-900">
                    Student Application
                  </h2>
                  <p className="text-gray-500">
                    Submitted on {form?.submittedAt}
                  </p>
                </div>
                <span className="px-3 py-1 text-xs border border-gray-300 rounded-md text-gray-600 w-fit">
                  {form.status}
                </span>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Student ID</p>
                  <p className="text-gray-900">{form.studentId}</p>
                </div>

                <div>
                  <p className="text-gray-500">Age</p>
                  <p className="text-gray-900">{form.age}</p>
                </div>

                <div>
                  <p className="text-gray-500">Class</p>
                  <p className="text-gray-900">{form.class}</p>
                </div>

                <div>
                  <p className="text-gray-500">Club ID</p>
                  <p className="text-gray-900">{form.clubId}</p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200" />

              {/* Long Text Sections */}
              <div className="flex flex-col gap-5">
                <div>
                  <p className="text-gray-500 mb-1">Skills</p>
                  <p className="text-gray-900 whitespace-pre-line">
                    {form.skills}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Experience</p>
                  <p className="text-gray-900 whitespace-pre-line">
                    {form.experience}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Why This Club</p>
                  <p className="text-gray-900 whitespace-pre-line">
                    {form.whyThisClub}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Personal Statement</p>
                  <p className="text-gray-900 whitespace-pre-line">
                    {form?.personalStatement}
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 mb-1">Additional Message</p>
                  <p className="text-gray-900 whitespace-pre-line">
                    {form.message}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Page;
