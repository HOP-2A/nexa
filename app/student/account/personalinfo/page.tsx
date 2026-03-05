"use client";

import AccountSideBar from "@/app/_component/accountSideBar";
import SideBar from "@/app/_component/sideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden">
      
      {/* Soft Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-300 rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20 -z-10"></div>

      {/* Main Sidebar */}
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />

      {/* Account Sidebar */}
      <AccountSideBar
        personalInformation={() => push("/student/account/personalinfo")}
        paymentHistory={() => push("/student/account/paymenthistory")}
        myclubs={() => push("/student/account/myclubs")}
        settings={() => push("/student/account/settings")}
      />

      {/* Main Content */}
      <main className="flex-1 p-8 md:p-12">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Account Dashboard
          </h1>
          <p className="text-gray-500 mt-3">
            Manage your personal information and activity.
          </p>
        </div>

        {/* Profile Card */}
        <div className="max-w-4xl backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl border border-white/40 p-10 transition-all duration-500 hover:shadow-indigo-200">
          
          {/* Profile Header */}
          <div className="flex items-center gap-8 mb-10">
            
            {/* Avatar */}
            <div className="relative group">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-3xl font-bold shadow-xl transition-transform duration-500 group-hover:scale-110">
                {user?.firstname?.[0]}
                {user?.lastname?.[0]}
              </div>
              <div className="absolute inset-0 rounded-full border-2 border-indigo-300 opacity-30 animate-pulse"></div>
            </div>

            {/* Name + Email */}
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">
                {user?.firstname} {user?.lastname}
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-10">
            <h3 className="text-xs font-semibold text-indigo-500 uppercase tracking-widest">
              About You
            </h3>
            <p className="text-gray-700 mt-4 text-lg leading-relaxed">
              {user?.bio || 
                "No bio added yet. Add something about your interests, learning goals, or achievements."
              }
            </p>
          </div>

          {/* Quick Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 pt-8 border-t border-gray-200/70">
            
            <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition">
              <p className="text-sm text-gray-500">Role</p>
              <h4 className="text-xl font-semibold text-indigo-600 mt-1">
                Student
              </h4>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition">
              <p className="text-sm text-gray-500">Account Status</p>
              <h4 className="text-xl font-semibold text-green-600 mt-1">
                Active
              </h4>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition">
              <p className="text-sm text-gray-500">Member Since</p>
              <h4 className="text-xl font-semibold text-purple-600 mt-1">
                2024
              </h4>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;