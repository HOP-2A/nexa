"use client";
import MentorSideBar from "@/app/_component/mentorSideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [inputValue, setInputValue] = useState({
    courseTitle: "",
    courseInfo: "",
    paymentValue: "",
  });
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const { push } = useRouter();
  const handleValue = (e: { target: { value: any; name: any } }) => {
    const { value, name } = e.target;
    if (name === "courseTitle") {
      setInputValue({ ...inputValue, courseTitle: value });
    }
    if (name === "courseInfo") {
      setInputValue({ ...inputValue, courseInfo: value });
    }

    if (name === "paymentValue") {
      setInputValue({ ...inputValue, paymentValue: value });
    }
    console.log(inputValue);
  };
  const createCourse = async () => {
    const res = await fetch("/api/mentor/createCourse", {
      method: "POST",
      body: JSON.stringify({
        courseTitle: inputValue.courseTitle,
        courseInfo: inputValue.courseInfo,
        paymentValue: inputValue.paymentValue,
        mentorId: user?.id,
      }),
    });
    if (res.ok) {
      console.log("created");
    }
  };

  return (
    <div className="min-h-screen flex bg-[radial-gradient(circle_at_20%_20%,#e0e7ff,transparent_40%),radial-gradient(circle_at_80%_0%,#d8b4fe,transparent_35%),#f8fafc]">
      <MentorSideBar
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/account")}
      />

      <div className="flex-1 flex justify-center items-start px-8 md:px-16 py-14">
        <div className="w-full max-w-2xl relative rounded-[32px] p-[1px] bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-400 shadow-2xl">
          <div className="bg-white/90 backdrop-blur-xl rounded-[32px] px-10 py-12 space-y-8">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Create a Course
              </h1>
              <p className="text-slate-500">
                Build your learning experience and start teaching 🚀
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">
                  Course Title
                </label>
                <input
                  name="courseTitle"
                  onChange={handleValue}
                  placeholder="Advanced Math Masterclass"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">
                  Course Information
                </label>
                <textarea
                  name="courseInfo"
                  onChange={handleValue}
                  placeholder="Describe what students will learn..."
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 h-32 resize-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-600">
                  Course Price
                </label>
                <input
                  name="paymentValue"
                  onChange={handleValue}
                  placeholder="$49"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
              </div>
            </div>


            <button
              onClick={createCourse}
              className="px-6 py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 font-semibold bg-white hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md"
            >
              🚀 Create Course
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
