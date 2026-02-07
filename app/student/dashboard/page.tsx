"use client";
import SideBar from "@/app/_component/sideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Club } from "lucide-react";
const Page = () => {
  const { push } = useRouter();
  const [mentors, setMentor] = useState([])
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const [clubs, setClubs] = useState([])

  const findAllmentors = async ()=>{
   const data =  await fetch("/api/mentor/findAllMentor",{
    method:"GET"
    })
    const datas = await data.json()
    setMentor(datas)
  }
  const fetchAllClubs = async()=>{
    const res = await fetch("/api/clubToStudents/allClubs",{
      method:"GET"
    })
    const response = await res.json()
    setClubs(response)

  }
  useEffect(()=>{
findAllmentors()
fetchAllClubs()
console.log(clubs)
if(clerkUser?.publicMetadata.role === "MENTOR"){
  push("/mentor/dashboard")
}
  },[user])

  const sortedClubs = clubs.sort((a,b)=>b.clubToStudents.length - a.clubToStudents.length)
  console.log(sortedClubs)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />
  
      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 space-y-12">
        
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Student Dashboard</h1>
          <p className="text-slate-500 mt-1">
            Learn, connect with mentors, and join top clubs 🚀
          </p>
        </div>
  
        {/* Mentors Section */}
        <section className="bg-white rounded-3xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Featured Mentors
            </h2>
            <button
              className="text-sm font-medium text-indigo-600 hover:underline"
              onClick={() => push("/student/mentors")}
            >
              View all
            </button>
          </div>
  
          <Carousel>
            <CarouselContent>
              {mentors?.map((ment) => (
                <CarouselItem
                  key={ment.id}
                  className="basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 p-3"
                >
                  <div
                    onClick={() =>
                      push(`/student/mentorProfile/${ment.id}`)
                    }
                    className="cursor-pointer bg-slate-50 rounded-2xl p-5 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                  >
               <div>  {ment?.profilePic === null ? <img src={"data:image/png;base64,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"}/> :<img src={ment?.profilePic}/>}</div>
  
                    <h3 className="font-semibold text-slate-800">
                      {ment.firstname}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Mentor
                    </p>
  
                    <button className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                      View Profile
                    </button>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
  
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </section>
  
        {/* Clubs Section */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              🏆 Top Clubs
            </h2>
          </div>
  
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedClubs.map((club, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <h3 className="text-lg font-semibold text-slate-800">
                  {club.name}
                </h3>
  
                <p className="text-sm text-slate-500 mt-2 line-clamp-3">
                  {club.description}
                </p>
  
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-slate-600">
                    👥 {club.clubToStudents.length} members
                  </span>
  
                  <div className="flex gap-2">
                    <button className="px-4 py-2 text-sm rounded-xl bg-slate-100 hover:bg-slate-200 transition">
                      View
                    </button>
                    <button className="px-4 py-2 text-sm rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
                      Join
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
  
      </div>
    </div>
  )
  
};
export default Page;
