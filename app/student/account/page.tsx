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
        myclubs={() => push("/student/account/myclubs")}
        settings={() => push("/student/account/settings")}
      />

      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-bold">Account Dashboard</h1>
      </main>
    </div>
  );
};

export default Page;
