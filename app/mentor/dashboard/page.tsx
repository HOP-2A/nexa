"use client"
import MentorSideBar from "@/app/_component/mentorSideBar"
import { useAuth } from "@/app/provider/authProvider"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const Page = ()=>{
    const [inputValue, setInputValue]= useState({
        courseTitle:"",
        courseInfo:"",
        paymentValue:""
    })
    const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
    const {push} = useRouter()
    const handleValue =(e: { target: { value: any; name: any } })=>{
const {value, name} = e.target
if(name==="courseTitle"){
    setInputValue({...inputValue, courseTitle:value})
}
if(name==="courseInfo"){
    setInputValue({...inputValue, courseInfo:value})
}

if(name==="paymentValue"){
    setInputValue({...inputValue, paymentValue:value})
}
console.log(inputValue)

    }  
    const createCourse = async ()=>{
      const res = await fetch("/api/mentor/createCourse",{
            method:"POST",
            body: JSON.stringify({
                courseTitle:inputValue.courseTitle,
                courseInfo:inputValue.courseInfo,
                paymentValue:inputValue.paymentValue,
                mentorId:user?.id
              }),
        })
        if(res.ok){
            console.log("created")
        }
    }

      return <div>
         <MentorSideBar
        home={() => push("/mentor/dashboard")}
        chat={() => push("/mentor/chat")}
        account={() => push("/mentor/dashboard/account")}

      />
      <div>create my course<div>
      </div>
      <input placeholder="courseTitle" name="courseTitle" onChange={handleValue}/>
      <input placeholder="courseInfo"  name="courseInfo" onChange={handleValue}/>
      <input placeholder="paymentValue"  name="paymentValue" onChange={handleValue}/>
      <button onClick={createCourse}>create my Course</button>
      </div>
    </div>
}
export default Page