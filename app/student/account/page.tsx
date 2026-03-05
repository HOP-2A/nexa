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
    <div className="min-h-screen flex bg-slate-50">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />
      <AccountSideBar
        personalInformation={() => push("/student/account/personalinfo")}
        paymentHistory={() => push("/student/account/paymenthistory")}
        myclubs={() => push("/student/myClubs")}
        settings={() => push("/student/account/settings")}
      />
 
      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">
          Account Dashboard
        </h1>
 
        {/* Profile Card */}
        <div className="max-w-3xl bg-white rounded-3xl shadow-lg border border-gray-200 p-8 md:p-10 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-20 w-20 rounded-full bg-indigo-600 text-white flex items-center justify-center text-2xl font-bold shadow-md">
              {user?.firstname?.[0]}
              {user?.lastname?.[0]}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {user?.firstname} {user?.lastname}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
            </div>
          </div>
 
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                Bio
              </h3>
              <p className="text-gray-700 mt-2 text-base">
                {user?.bio || "No bio added yet."}
              </p>
            </div>
 
         
          </div>
        </div>
      </main>
    </div>
  );
};
 
export default Page;  
