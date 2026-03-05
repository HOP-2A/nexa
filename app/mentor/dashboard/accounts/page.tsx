"use client";

import MentorSideBar from "@/app/_component/mentorSideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const AccountPage = () => {
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const router = useRouter();

  const push = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex">
        <MentorSideBar
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/accounts")}
        editProfile={()=> push("/mentor/dashboard/editProfile")}
      />
      
      {/* Soft Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20 -z-10"></div>

    

      <div className="w-full max-w-4xl backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/40 overflow-hidden transition-all duration-500 hover:shadow-purple-200">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-12 text-white">
          <div className="flex items-center gap-8">

            {/* Avatar */}
            <div className="relative group">
              <div className="h-28 w-28 rounded-full bg-white/20 backdrop-blur-md border-4 border-white/50 flex items-center justify-center text-4xl font-bold shadow-xl transition-transform duration-500 group-hover:scale-110">
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-white opacity-40 animate-pulse"></div>
            </div>

            {/* Name + Email */}
            <div>
              <h2 className="text-4xl font-bold tracking-tight drop-shadow-md">
                {user?.firstname} {user?.lastname}
              </h2>
              <p className="text-indigo-100 text-sm mt-3 tracking-wide">
                {user?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">

          {/* Bio Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 border border-gray-200/60 shadow-sm hover:shadow-lg transition duration-300">
            <h3 className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
              About Me
            </h3>

            <p className="text-gray-700 mt-4 text-lg leading-relaxed">
              {user?.bio || 
                "No bio added yet. Add something about yourself to personalize your profile and let others know your expertise and interests."
              }
            </p>
          </div>

          {/* Quick Stats Section */}
          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t border-gray-200/70">
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl p-6 border hover:shadow-md transition">
              <p className="text-sm text-gray-500">Role</p>
              <h4 className="text-xl font-semibold text-indigo-600 mt-1">
                Mentor
              </h4>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border hover:shadow-md transition">
              <p className="text-sm text-gray-500">Status</p>
              <h4 className="text-xl font-semibold text-purple-600 mt-1">
                Active
              </h4>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white rounded-xl p-6 border hover:shadow-md transition">
              <p className="text-sm text-gray-500">Member Since</p>
              <h4 className="text-xl font-semibold text-pink-600 mt-1">
                2024
              </h4>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AccountPage;
