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
const Page = () => {
  const { push } = useRouter();
  const [mentors, setMentor] = useState([])
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  console.log(user);
  const findAllmentors = async ()=>{
   const data =  await fetch("/api/mentor/findAllMentor",{
    method:"GET"
    })
    const datas = await data.json()
    setMentor(datas)
  }
  useEffect(()=>{
findAllmentors()
  },[])
  console.log(mentors)
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <SideBar
        home={() => push("/student/dashboard")}
        members={() => push("/student/mentors")}
        account={() => push("/student/account/personalinfo")}
        news={() => push("/student/news")}
      />
  
      {/* Page Content */}
      <div className="flex-1">
        <main className="p-4 md:p-8">
          <h1 className="text-2xl font-bold mb-6 hidden md:block">Dashboard</h1>
          <h1 className="text-2xl font-bold mb-6 hidden md:block">Mentors</h1>
  
          <div className="bg-white rounded-2xl shadow-sm p-6 overflow-hidden">
            <Carousel className="w-full">
              <CarouselContent>
                {mentors?.map((ment) => (
                  <CarouselItem
                    key={ment.id}
                    className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 p-2"
                  >
                    <div className="bg-slate-100 rounded-xl p-6 text-center font-semibold" onClick={()=>{
                      push(`/mentor/${ment.id}`)
                    }}>
                      {ment.firstname}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </main>
        <div> hi</div>
      </div>
 
    </div>
  )
  
  
};
export default Page;
