"use client"
import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel"
import SideBar from "@/app/_component/sideBar"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BookOpen, User, Star } from "lucide-react"

const Page = () => {
  const [mentor, setMentor] = useState<any>()
  const [courses, setCourses] = useState<any[]>([])
  const { push } = useRouter()
  const params = useParams()
  const mentorId = params.mentorId

  const fetchMentorData = async () => {
    try {
      const [mentorRes, coursesRes] = await Promise.all([
        fetch(`/api/mentor/findSingleMentor/${mentorId}`).then(res => res.json()),
        fetch(`/api/course/findSpecificCourse/${mentorId}`).then(res => res.json())
      ])
      setMentor(mentorRes)
      setCourses(coursesRes)
    } catch (error) {
      console.error("Failed to fetch data", error)
    }
  }

  useEffect(() => {
    fetchMentorData()
  }, [mentorId])

  // Logic to render stars based on numeric rating
  const renderStars = (rating: number | null) => {
    const stars = [];
    const currentRating = rating || 0;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`w-4 h-4 ${i <= currentRating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="relative min-h-screen flex bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-700">
      
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />

      <main className="flex-1 relative z-10 px-6 md:px-12 py-12 lg:ml-20">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* --- Mentor Header --- */}
          <section className="relative">
            <div className="relative bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-xl">
              <div className="flex flex-col md:flex-row items-center gap-10">
                
                {/* Avatar */}
                <div className="relative">
                  <div className="h-40 w-40 rounded-3xl overflow-hidden ring-1 ring-slate-700 p-1 bg-slate-800 shadow-2xl flex items-center justify-center">
                    {mentor?.profilePic ? (
                      <img
                        src={mentor.profilePic}
                        className="h-full w-full object-cover rounded-[1.25rem]"
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-700 rounded-[1.25rem] flex items-center justify-center">
                        <User className="w-16 h-16 text-slate-500" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="space-y-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                      <Badge variant="outline" className="w-fit mx-auto md:mx-0 text-indigo-400 border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                        Mentor Profile
                      </Badge>
                      
                      {/* Dynamic Rating Logic */}
                      <div className="flex items-center justify-center md:justify-start gap-1">
                        {renderStars(mentor?.rating)}
                        {mentor?.rating ? (
                           <span className="ml-2 text-xs font-bold text-slate-400">{mentor.rating}</span>
                        ) : (
                           <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">No ratings yet</span>
                        )}
                      </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white leading-none">
                      {mentor?.firstname} <span className="text-slate-500">{mentor?.lastname}</span>
                    </h1>
                  </div>

                  <p className="text-slate-400 text-lg leading-relaxed max-w-2xl font-light">
                
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* --- Available Courses --- */}
          <section className="space-y-8">
            <div className="flex items-center gap-3 px-2">
              <div className="h-8 w-2 bg-indigo-600 rounded-full"></div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Courses</h2>
            </div>

            <Carousel className="w-full relative">
              <CarouselContent className="-ml-6">
                {courses?.map((cs: any) => (
                  <CarouselItem
                    key={cs.id}
                    className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3"
                  >
                    <div
                      onClick={() => push(`/student/mentorProfile/${mentorId}/${cs.id}`)}
                      className="group cursor-pointer relative h-full bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] transition-all duration-300 hover:border-indigo-500/50 hover:shadow-2xl"
                    >
                      <div className="mb-12 flex justify-between items-start">
                        <div className="p-4 bg-slate-800 rounded-2xl text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                          <BookOpen className="w-6 h-6" />
                        </div>
                        <div className="w-10 h-10 flex items-center justify-center rounded-full border border-slate-700 group-hover:border-white transition-colors">
                          <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all" />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 leading-tight group-hover:text-indigo-300 transition-colors">
                        {cs.courseTitle}
                      </h3>
                      
                      <p className="text-slate-400 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                        View details for this specialized track under {mentor?.firstname}'s guidance.
                      </p>

                      <div className="pt-6 border-t border-slate-800/50">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-indigo-400 transition-colors">
                          Syllabus Details
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex gap-4 mt-10 md:justify-end">
                <CarouselPrevious className="static translate-y-0 h-12 w-12 border-slate-200 bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all" />
                <CarouselNext className="static translate-y-0 h-12 w-12 border-slate-200 bg-white text-slate-900 hover:bg-slate-900 hover:text-white transition-all" />
              </div>
            </Carousel>
          </section>

        </div>
      </main>
    </div>
  )
}

export default Page
