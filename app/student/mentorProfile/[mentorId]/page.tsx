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

  const renderStars = (rating?: string) => {
    const ratingMap: any = { FIVE: 5, FOUR: 4, THREE: 3, TWO: 2, ONE: 1, NONE: 0 }
    const ratingNumber = ratingMap[rating || "NONE"]
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={`${i < ratingNumber ? "text-indigo-500 fill-indigo-500" : "text-zinc-800 fill-zinc-800"}`}
      />
    ))
  }

  return (
    <div className="min-h-screen flex bg-[#020202] text-zinc-100 selection:bg-indigo-500/30">
      
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />

      <main className="flex-1 relative overflow-hidden">
        {/* Atmospheric Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] -z-10 rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-20">
          
          {/* MENTOR HERO SECTION */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Profile Image (Portrait Style) */}
              <div className="lg:col-span-4 flex justify-center lg:justify-start">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
                  <div className="relative h-[450px] w-full md:w-[350px] bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-700">
                    {mentor?.profilePic ? (
                      <img src={mentor.profilePic} className="h-full w-full object-cover" alt="Mentor" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-zinc-800">
                        <User size={80} className="text-zinc-700" />
                      </div>
                    )}
                    {/* Floating Info Tag */}
                    <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl">
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
              <div className="lg:col-span-8 space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <Badge className="bg-white/5 text-zinc-400 border-white/10 px-4 py-1 uppercase tracking-[0.2em] text-[10px] rounded-full">
                    Executive Mentor
                  </Badge>
                  <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-none">
                    {mentor?.firstname} <br />
                    <span className="text-indigo-600">{mentor?.lastname}</span>
                  </h1>
                </div>

                <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                  Leading specialized industry tracks through strategic architecture and high-performance design. Join {mentor?.firstname}'s inner circle to master advanced concepts.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-8 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Students</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">1.2k+</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Industry</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">Tech Arch</p>
                  </div>
                  <div className="space-y-1 hidden md:block">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Language</p>
                    <p className="text-2xl font-bold text-white tracking-tighter">EN / DE</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>

          {/* COURSE TRACKS SECTION */}
          <section className="space-y-10">
            <div className="flex items-end justify-between px-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-indigo-500 font-bold text-[10px] tracking-[0.3em] uppercase">
                  <Zap size={14} /> Knowledge Tracks
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                  Active Modules<span className="text-indigo-600">.</span>
                </h2>
              </div>
            </div>

            <Carousel className="w-full relative group">
              <CarouselContent className="-ml-6">
                {courses?.map((cs: any, idx) => (
                  <CarouselItem key={cs.id} className="pl-6 basis-full sm:basis-1/2 lg:basis-1/3">
                    <motion.div
                      whileHover={{ y: -10 }}
                      onClick={() => push(`/student/mentorProfile/${mentorId}/${cs.id}`)}
                      className="cursor-pointer bg-zinc-900/50 border border-white/5 p-8 rounded-[2.5rem] hover:bg-zinc-900 hover:border-indigo-500/50 transition-all duration-500 group/card h-full flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-12">
                          <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-500 group-hover/card:bg-indigo-600 group-hover/card:text-white transition-all">
                            <BookOpen size={24} />
                          </div>
                          <div className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 group-hover/card:border-white transition-all">
                            <ArrowRight size={18} className="text-zinc-600 group-hover/card:text-white" />
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter italic leading-tight group-hover/card:text-indigo-400">
                          {cs.courseTitle}
                        </h3>
                        <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3">
                          Access exclusive technical curriculum and mentorship frameworks under the guidance of {mentor?.firstname}.
                        </p>
                      </div>

                      <div className="pt-8 mt-8 border-t border-white/5 flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 group-hover/card:text-indigo-400">Track Module {idx + 1}</span>
                        <Globe size={14} className="text-zinc-700" />
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              {/* Enhanced Controls */}
              <div className="flex gap-4 mt-12 md:justify-end">
                <CarouselPrevious className="static translate-y-0 h-14 w-14 rounded-2xl border-white/5 bg-zinc-900 text-zinc-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all" />
                <CarouselNext className="static translate-y-0 h-14 w-14 rounded-2xl border-white/5 bg-zinc-900 text-zinc-400 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all" />
              </div>
            </Carousel>
          </section>

        </div>
      </main>
    </div>
  )
}

export default Page