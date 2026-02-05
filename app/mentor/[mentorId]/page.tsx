"use client"
import SideBar from "@/app/_component/sideBar"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
const Page = ()=>{
    const [mentor, setMentor] = useState()
    const [course, setCourse] = useState([])
    const [selectedCourse, setSelectedCourse] = useState<any>(null)
    const {push} = useRouter()
    const params = useParams()
    const mentorId = params.mentorId
    const fetchMentorId = async ()=>{
        const data = await fetch(`/api/mentor/findSingleMentor/${mentorId}`,{
            method:"GET",
    } )
    const res = await data.json()
setMentor(res)
    }
    const mentorsCourses = async ()=>{
        const data = await fetch(`/api/course/findSpecificCourse/${mentorId}`,{
            method:"GET"
        })
        const res = await data.json()
        setCourse(res)
    }
    useEffect(()=>{
fetchMentorId()
mentorsCourses()
    },[])
    return (
        <div className="min-h-screen bg-slate-50 md:flex">
          
          <SideBar
            home={() => push("/student/dashboard")}
            members={() => push("/student/mentors")}
            account={() => push("/student/account/personalinfo")}
            news={() => push("/student/news")}
          />
    
          <div className="flex-1">
            <main className="p-4 md:p-8">
    
              {/* Mentor Header */}
              <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
                <h1 className="text-2xl font-semibold text-slate-800">
                  {mentor?.firstname} {mentor?.lastname}
                </h1>
                <p className="text-slate-500 mt-2">{mentor?.bio}</p>
              </div>
    
              {/* Courses */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Courses Offered
                </h2>
    
                <div className="space-y-3">
                <Carousel className="w-full">
              <CarouselContent>
              {course?.map((cs: any) => (
                    <div
                      key={cs.id}
                      onClick={() => setSelectedCourse(cs)}
                      className="border rounded-xl px-4 py-3 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                    >
                      <span className="font-medium text-slate-800">
                        {cs.courseTitle}
                      </span>
                    </div>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>

                </div>
              </div>
    
            </main>
          </div>
    
          {/* ================= MODAL WINDOW ================= */}
          {selectedCourse && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative animate-fadeIn">
    
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 text-xl"
                >
                  ✕
                </button>
    
                <h2 className="text-2xl font-bold text-slate-800 mb-3">
                  {selectedCourse.courseTitle}
                </h2>
    
                <p className="text-slate-600 mb-4">
                  {selectedCourse.courseInfo}
                </p>
    
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <p className="font-semibold text-indigo-700">
                    Price: {selectedCourse.paymentValue}
                  </p>
                </div>
    
              </div>
            </div>
          )}
          {/* ================================================= */}
    
        </div>
      )
}
export default Page