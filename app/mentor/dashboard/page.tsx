"use client"
import MentorSideBar from "@/app/_component/mentorSideBar"
import { useRouter } from "next/navigation"

const Page = ()=>{
    const {push}= useRouter()
    
    return (<div className="min-h-screen flex bg-[radial-gradient(circle_at_20%_20%,#e0e7ff,transparent_40%),radial-gradient(circle_at_80%_0%,#d8b4fe,transparent_35%),#f8fafc]">
          
    <MentorSideBar
      home={() => push("/mentor/dashboard")}
      chat={() => push("/mentor/chat")}
      account={() => push("/mentor/dashboard/account")}
    />

    {/* RIGHT SIDE */}
    <div className="flex-1 flex justify-center items-start px-8 md:px-16 py-14">
      
      <div className="w-full max-w-2xl relative rounded-[32px] p-[1px] bg-gradient-to-br from-indigo-500 via-violet-500 to-sky-400 shadow-2xl">

   hi
   <button onClick={()=>{
push("/mentor/dashboard/createCourse")
   }}>go to create course</button>
      </div>
      <div onClick={()=>{
        push("/mentor/dashboard/dates")
      }}>available courses' dates</div>
    </div>
  </div>
)
}
export default Page