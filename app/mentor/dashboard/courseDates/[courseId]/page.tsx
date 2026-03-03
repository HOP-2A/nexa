"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { CalendarDaysIcon, Clock2Icon, ClockIcon, PlusIcon, SparklesIcon } from "lucide-react"
import { useAuth } from "@/app/provider/authProvider"
import { useUser } from "@clerk/nextjs"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import MentorSideBar from "@/app/_component/mentorSideBar"
import { toast } from "sonner"

const Page=()=>{
    const [date, setDate] = React.useState<Date | undefined>(
        new Date(new Date().getFullYear(), new Date().getMonth(), 12)
      )
      const {push} = useRouter()
      const today = new Date()
      today.setHours(0, 0, 0, 0)
    const params = useParams()
    const [timeValue, setTimeValue] = useState({
        startTime:"",
        endTime:""
    })
    console.log(date,timeValue)
    const courseId = params.courseId
    const { user: clerkUser } = useUser();
    const { user } = useAuth(clerkUser?.id);
const handleInputValue = (e: { target: { value: any; name: any } })=>{
    const {value, name}= e.target
    if(name==="startTime"){
        setTimeValue({...timeValue, startTime:value })

    }
    if(name==="endTime"){
        setTimeValue({...timeValue, endTime:value })

    }

}
const mentorAvailable = async()=>{
    
const res = await fetch("/api/mentorAvailable",{
    method:"POST",
    headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
       mentorId: user?.id,
       courseId:courseId,
      availableDate:date,
      startTime:timeValue.startTime,
      endTime:timeValue.endTime
      }),
      
}
)
if(res.ok){
  toast.success("Successfully created courseDate")
}
}
return (
  <div className="flex min-h-screen bg-[#F8FAFC]">
    <MentorSideBar
      home={() => push("/mentor/dashboard")}
      chat={() => push("/mentor/chat")}
      account={() => push("/mentor/dashboard/account")}
    />

    <main className="flex-1 p-6 lg:p-10 flex flex-col xl:flex-row gap-10 max-w-7xl mx-auto w-full">
      {/* LEFT COLUMN: The Interface */}
      <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <header className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Manage Availability</h1>
          <p className="text-slate-500 font-medium">Set your working hours and let students book your time.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Calendar Card - Spans 7 cols */}
          <Card className="md:col-span-7 border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] bg-white overflow-hidden">
            <CardContent className="p-8">
              <Calendar
                disabled={(date) => date < today}
                mode="single"
                selected={date}
                onSelect={setDate}
                className="mx-auto"
                classNames={{
                  day_selected: "bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-200",
                  day_today: "bg-indigo-50 text-indigo-700 font-bold rounded-xl",
                  day: "h-11 w-11 p-0 font-normal hover:bg-slate-100 rounded-xl transition-all",
                }}
              />
            </CardContent>
          </Card>

          {/* Time Selection - Spans 5 cols */}
          <Card className="md:col-span-5 border-none shadow-2xl shadow-slate-200/50 rounded-[2rem] bg-indigo-600 text-white overflow-hidden">
            <CardContent className="p-8 flex flex-col h-full justify-between">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Select Hours</h3>
                  <p className="text-indigo-100 text-xs">For {date ? date.toDateString() : 'selected date'}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">Start</label>
                    <input 
                      type="time" 
                      name="startTime"
                      onChange={handleInputValue}
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:bg-white focus:text-slate-900 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-indigo-200">End</label>
                    <input 
                      type="time" 
                      name="endTime"
                      onChange={handleInputValue}
                      className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:bg-white focus:text-slate-900 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={mentorAvailable}
                className="mt-8 w-full py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition-colors shadow-xl"
              >
                Confirm Slot
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RIGHT COLUMN: Context & Info (The "Content Filler") */}
      <aside className="w-full xl:w-[350px] space-y-6 animate-in fade-in slide-in-from-right-4 duration-1000">
        {/* Quick Stats */}
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100">
          <h4 className="font-bold text-slate-800 mb-4">Availability Summary</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50">
              <div className="size-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CalendarDaysIcon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Monthly Slots</p>
                <p className="text-sm font-bold text-slate-800">24 Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-slate-50">
              <div className="size-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                <ClockIcon className="size-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Avg. Duration</p>
                <p className="text-sm font-bold text-slate-800">45 Minutes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Informational Hint */}
        <div className="relative group overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-[2rem] text-white shadow-2xl">
          <SparklesIcon className="absolute -right-4 -top-4 size-24 text-white/5 rotate-12" />
          <h4 className="relative z-10 font-bold mb-2">Pro Tip</h4>
          <p className="relative z-10 text-slate-400 text-sm leading-relaxed">
            Mentors with at least 3 evening slots per week get <span className="text-white font-semibold">40% more bookings</span> from international students.
          </p>
        </div>
        
        {/* Visual Decoration */}
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-center space-y-3">
          <div className="size-12 rounded-full bg-slate-100 flex items-center justify-center">
             <PlusIcon className="size-6 text-slate-300" />
          </div>
          <p className="text-xs text-slate-400 font-medium">More analytics coming soon</p>
        </div>
      </aside>
    </main>
  </div>
);
}
export default Page