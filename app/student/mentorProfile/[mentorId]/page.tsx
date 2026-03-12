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
import { ArrowRight, BookOpen, User, Star, Globe, Zap, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

// Interfaces for better type safety
interface Mentor {
  firstname: string;
  lastname: string;
  profilePic?: string;
  rating?: string;
}

interface Course {
  id: string;
  courseTitle: string;
}

const Page = () => {
  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const { push } = useRouter()
  const params = useParams()
  const mentorId = params.mentorId as string

  const fetchMentorData = async () => {
    try {
      const [mentorRes, coursesRes] = await Promise.all([
        fetch(`/api/mentor/findSingleMentor/${mentorId}`).then(res => res.json()),
        fetch(`/api/course/findSpecificCourse/${mentorId}`).then(res => res.json())
      ])
      setMentor(mentorRes)
      setCourses(Array.isArray(coursesRes) ? coursesRes : [])
    } catch (error) {
      console.error("Failed to fetch data", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (mentorId) fetchMentorData()
  }, [mentorId])

  const renderStars = (rating?: string) => {
    const ratingMap: Record<string, number> = { FIVE: 5, FOUR: 4, THREE: 3, TWO: 2, ONE: 1, NONE: 0 }
    const ratingNumber = ratingMap[rating || "NONE"] || 0
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < ratingNumber ? "text-indigo-500 fill-indigo-500" : "text-zinc-800 fill-zinc-800"}`}
      />
    ))
  }

  if (loading) return <div className="min-h-screen bg-[#020202] flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020202] text-zinc-100 selection:bg-indigo-500/30">
      
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />

      <main className="flex-1 relative overflow-x-hidden">
        {/* Atmospheric Glow */}
        <div className="absolute top-0 right-0 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-indigo-600/10 blur-[100px] md:blur-[150px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-purple-600/5 blur-[80px] md:blur-[120px] -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 space-y-16 md:space-y-20">
          
          {/* MENTOR HERO SECTION */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Profile Image */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start order-2 lg:order-1">
                <div className="relative group w-full max-w-[350px]">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative aspect-[3/4] lg:h-[450px] w-full bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 lg:grayscale hover:grayscale-0 transition-all duration-700">
                    {mentor?.profilePic ? (
                      <img src={mentor.profilePic} className="h-full w-full object-cover" alt="Mentor" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-zinc-800">
                        <User size={80} className="text-zinc-700" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
                       <div className="flex items-center gap-2 mb-1">
                          <ShieldCheck size={14} className="text-indigo-400" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Verified Expert</span>
                       </div>
                       <div className="flex items-center gap-1">{renderStars(mentor?.rating)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Stats */}
              <div className="lg:col-span-8 space-y-6 md:space-y-8 text-center lg:text-left order-1 lg:order-2">
                <div className="space-y-4">
                  <Badge className="bg-white/5 text-zinc-400 border-white/10 px-4 py-1 uppercase tracking-[0.2em] text-[10px] rounded-full">
                    Executive Mentor
                  </Badge>
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.9]">
                    {mentor?.firstname} <br />
                    <span className="text-indigo-600">{mentor?.lastname}</span>
                  </h1>
                </div>

                <p className="text-zinc-400 text-base md:text-xl font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
                  Leading specialized industry tracks through strategic architecture and high-performance design. Join {mentor?.firstname}'s inner circle to master advanced concepts.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Students</p>
                    <p className="text-xl md:text-2xl font-bold text-white tracking-tighter">1.2k+</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Industry</p>
                    <p className="text-xl md:text-2xl font-bold text-white tracking-tighter">Tech Arch</p>
                  </div>
                  <div className="space-y-1 col-span-2 md:col-span-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Language</p>
                    <p className="text-xl md:text-2xl font-bold text-white tracking-tighter">EN / DE</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* COURSE TRACKS SECTION */}
          <section className="space-y-8 md:space-y-10">
            <div className="flex items-end justify-between px-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-500 font-bold text-[10px] tracking-[0.3em] uppercase">
                  <Zap size={14} /> Knowledge Tracks
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
                  Active Modules<span className="text-indigo-600">.</span>
                </h2>
              </div>
            </div>

            <Carousel className="w-full relative group" opts={{ align: "start", loop: true }}>
              <CarouselContent className="-ml-4 md:-ml-6">
                {courses.length > 0 ? (
                  courses.map((cs, idx) => (
                    <CarouselItem key={cs.id} className="pl-4 md:pl-6 basis-[90%] sm:basis-1/2 lg:basis-1/3">
                      <motion.div
                        whileHover={{ y: -10 }}
                        onClick={() => push(`/student/mentorProfile/${mentorId}/${cs.id}`)}
                        className="cursor-pointer bg-zinc-900/50 border border-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] hover:bg-zinc-900 hover:border-indigo-500/50 transition-all duration-500 group/card h-full flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-8 md:mb-12">
                            <div className="p-3 md:p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover/card:bg-indigo-600 group-hover/card:text-white transition-all">
                              <BookOpen size={24} />
                            </div>
                            <div className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 group-hover/card:border-white transition-all">
                              <ArrowRight size={18} className="text-zinc-600 group-hover/card:text-white" />
                            </div>
                          </div>

                          <h3 className="text-xl md:text-2xl font-bold text-white mb-4 uppercase tracking-tighter italic leading-tight group-hover/card:text-indigo-400">
                            {cs.courseTitle}
                          </h3>
                          <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3">
                            Access exclusive technical curriculum and mentorship frameworks under the guidance of {mentor?.firstname}.
                          </p>
                        </div>

                        <div className="pt-6 md:pt-8 mt-6 md:mt-8 border-t border-white/5 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover/card:text-indigo-400">Track Module {idx + 1}</span>
                          <Globe size={14} className="text-zinc-700" />
                        </div>
                      </motion.div>
                    </CarouselItem>
                  ))
                ) : (
                  <div className="pl-6 text-zinc-500 italic">No courses available yet.</div>
                )}
              </CarouselContent>

              <div className="flex gap-4 mt-8 md:mt-12 justify-center md:justify-end">
                <CarouselPrevious className="static translate-y-0 h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border-white/5 bg-zinc-900 text-zinc-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all" />
                <CarouselNext className="static translate-y-0 h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl border-white/5 bg-zinc-900 text-zinc-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all" />
              </div>
            </Carousel>
          </section>

        </div>
      </main>
    </div>
  )
}

export default Page