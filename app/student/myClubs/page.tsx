"use client"
import SideBar from "@/app/_component/sideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

const Page = ()=>{
    const [clubs, setClubs]=useState([])
    const { user: clerkUser } = useUser();
    const { user } = useAuth(clerkUser?.id);
    const  {push} = useRouter()
    const fetchAllClubs = async()=>{
        const res = await fetch("/api/clubToStudents/allClubs",{
          method:"GET"
        })
        const response = await res.json()
        setClubs(response)
    
      }
      useEffect(()=>{
        fetchAllClubs()
      },[])
      const cluba = clubs.filter((club)=>{
        return club.clubToStudents.some((member)=>{
          return member.studentId === user?.id
        })
      })
      console.log(cluba)
      return (
        <div className="flex min-h-screen bg-slate-50">
          <SideBar
            home={() => push("/student/dashboard")}
            members={() => push("/student/mentors")}
            account={() => push("/student/account/personalinfo")}
            news={() => push("/student/myClubs")}
          />
      
          <main className="flex-1 p-8">
            <header className="mb-10">
              <h1 className="text-3xl font-bold text-slate-800">My Clubs</h1>
              <p className="text-slate-500">You are currently active in {cluba.length} clubs</p>
            </header>
      
            {/* The Unique Feature: Animated Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cluba.map((club) => (
                <div 
                  key={club.id} 
                  className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl border border-slate-100"
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-indigo-50 transition-transform group-hover:scale-150" />
      
                  <div className="relative z-10">
              
                    <h3 className="mt-4 text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {club.name}
                    </h3>
                    
                    <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {club.description}
                    </p>
      
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {/* Visualizing the clubToStudents array length */}
                        {club.clubToStudents?.slice(0, 3).map((_, i) => (
                          <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-200" />
                        ))}
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-medium text-slate-500">
                          +{club.clubToStudents?.length}
                        </div>
                      </div>
                      
                      <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-600" onClick={()=>{
                        push(`/student/Clubs/${club.id}`)
                      }}>
                        View Club
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      );
}
export default Page