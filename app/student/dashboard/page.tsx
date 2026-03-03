"use client";
import SideBar from "@/app/_component/sideBar";
import { useAuth } from "@/app/provider/authProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";


const Page = () => {
  const { push } = useRouter();
  const [mentors, setMentor] = useState([])
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const [clubs, setClubs] = useState([])
  const [studentBooked, setStudentBooked]= useState([])
  

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
  const fetchData= async () => {
  const res = await fetch("/api/mentorAvailability/studentBooked", {
      method: "POST",
      body: JSON.stringify({
        studentId:user?.id
      }),
    });
    const response = await res.json();
    setStudentBooked(response);
  };
  useEffect(()=>{
findAllmentors()
fetchAllClubs()
fetchData()
console.log(clubs)
if(clerkUser?.publicMetadata.role === "MENTOR"){
  push("/mentor/dashboard")
}
  },[user])

  const sortedClubs = clubs.sort((a,b)=>b.clubToStudents.length - a.clubToStudents.length)
  console.log(sortedClubs)
  const cluba = sortedClubs.filter((club)=>{
    return !club.clubToStudents.some((member)=>{
      return member.studentId === user?.id
    })
  })
  console.log(cluba)

  
  return (
    <div className="min-h-screen bg-[#f8fafc] flex font-sans text-slate-900">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/myClubs")}
      />
  
      <main className="flex-1 p-8 lg:p-12 space-y-16 overflow-x-hidden">
        
        {/* 1. HERO HEADER */}
        <header className="relative">
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl -z-10" />
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-slate-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
            Student Hub
          </h1>
        </header>
  
        {/* 2. RESERVATIONS & HISTORY SECTION */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Booking Management</h2>
          
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* LEFT: Active Reservations */}
            <div className="flex-1 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Tickets</p>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
                {studentBooked.map((res, i) => (
                  <div key={i} className="snap-center flex-shrink-0 w-80 group">
                    <div className="relative bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-xl shadow-slate-200/40 transition-all duration-500 group-hover:-translate-y-1">
                      <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                        <span className="text-[9px] font-black tracking-widest uppercase opacity-80">Upcoming</span>
                        <span className="text-[10px] font-bold"> {new Date(res.availableDate).toLocaleDateString()}</span>
                      </div>
                      <div className="p-8">
                        <div className="flex justify-between items-end mb-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Start</p>
                            <p className="text-2xl font-black text-slate-800">{res.startTime}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">End</p>
                            <p className="text-2xl font-black text-indigo-600">{res.endTime}</p>
                          </div>
                        </div>
                        
                        <Dialog>
                          <DialogTrigger asChild>
                            <button className="w-full py-3 bg-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-100">
                              See Details
                            </button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[3rem] bg-white/95 backdrop-blur-2xl p-8 border-none">
                            <DialogHeader><DialogTitle className="text-2xl font-black">Booking Details</DialogTitle></DialogHeader>
                            <div className="mt-4 space-y-4">
                               <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center">
                                  <p className="text-xs text-slate-400 font-bold uppercase mb-2">Mentor Session</p>
                                  <p className="text-lg font-bold text-slate-800">
                                    {new Date(res.availableDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                                  </p>
                                  <p className="text-indigo-600 font-black text-xl mt-1">
                                    {res.startTime} — {res.endTime}
                                  </p>
                               </div>
                               <div className="flex gap-3">
                                  <button className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs hover:bg-indigo-700 transition-colors">Join Meeting</button>
                                  <button className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-colors">Cancel</button>
                               </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* RIGHT: History Column */}
            <div className="w-full lg:w-72 space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session History</p>
              <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 shadow-sm max-h-[280px] overflow-y-auto custom-scrollbar">
                {studentBooked.length > 0 ? (
                  <div className="space-y-6">
                    {studentBooked.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 group">
                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                          <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-800">Session Done</p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {new Date(item.availableDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-10 italic">No history yet.</p>
                )}
              </div>
            </div>
  
          </div>
        </section>
  
        {/* 3. MENTORS */}
        <section className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">Expert Mentors</h2>
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {mentors?.map((ment) => (
                <CarouselItem key={ment.id} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div onClick={() => push(`/student/mentorProfile/${ment.id}`)} className="group relative pt-10 cursor-pointer">
                    <div className="bg-white rounded-[3rem] p-10 pt-16 text-center border border-slate-100 shadow-lg transition-all hover:-translate-y-2">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2">
                         <div className="relative">
                            <div className="absolute -inset-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full blur opacity-0 group-hover:opacity-40 transition duration-500" />
                            <img src={ment?.profilePic || `https://ui-avatars.com/api/?name=${ment.firstname}&background=6366f1&color=fff`} className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" />
                         </div>
                      </div>
                      <h3 className="font-black text-xl text-slate-900 tracking-tight">{ment.firstname}</h3>
                      <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mt-2">Specialist</p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
  
        {/* 4. CLUBS */}
        <section className="pb-24">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Exclusive Communities</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {cluba.map((club, index) => (
              <div key={index} className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-[4rem] -z-0 group-hover:bg-indigo-600 transition-colors" />
                <h3 className="relative z-10 text-2xl font-black text-slate-900 group-hover:text-white transition-colors">{club.name}</h3>
                <p className="relative z-10 text-slate-500 mt-4 text-sm group-hover:text-indigo-50 transition-colors line-clamp-2">{club.description}</p>
                <div className="mt-8 flex justify-between items-center relative z-10">
                  <div className="text-[10px] font-bold text-slate-400 group-hover:text-indigo-200 tracking-widest uppercase">{club.clubToStudents?.length || 0} Members</div>
                  <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-lg">Join</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
export default Page;
