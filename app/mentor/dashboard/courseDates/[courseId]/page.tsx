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
import { Clock2Icon } from "lucide-react"
import { useAuth } from "@/app/provider/authProvider"
import { useUser } from "@clerk/nextjs"

import { useParams } from "next/navigation"
import { useState } from "react"

const Page=()=>{
    const [date, setDate] = React.useState<Date | undefined>(
        new Date(new Date().getFullYear(), new Date().getMonth(), 12)
      )
      
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
    
await fetch("/api/mentorAvailable",{
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
})
}
    return <div>
         <Card size="sm" className="mx-auto w-fit">
      <CardContent>
        <Calendar
         disabled={(date) => date < today}
          mode="single"
          selected={date}
          onSelect={setDate}
          className="p-0"
        />
      </CardContent>
      <CardFooter className="bg-card border-t">
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="time-from">Start Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="time-from"
                type="time"
                
                
                onChange={handleInputValue}
                name="startTime"
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor="time-to">End Time</FieldLabel>
            <InputGroup>
              <InputGroupInput
                 onChange={handleInputValue}
                 name="endTime"
                id="time-to"
                type="time"
               
               
                className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
              <InputGroupAddon>
                <Clock2Icon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
          </Field>
        </FieldGroup>
      </CardFooter>
    </Card>
        
        <button onClick={mentorAvailable}>submit</button>
        </div>
}
export default Page