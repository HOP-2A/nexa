import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
const body = await req.json()
const findExisted = await prisma.mentorAvailability.findFirst({
where:{
  startTime:body.startTime,
  endTime:body.endTime,
  availableDate:body.availableDate
}
})
if(findExisted){ return NextResponse.json(
  { error: "This time slot is already booked." },
  { status: 404 }
);}
if(!findExisted){
  const mentors = await prisma.mentorAvailability.create({
  data:{ 
      startTime:body.startTime,
      endTime:body.endTime,
      mentorId:body.mentorId,
      courseId:body.courseId,
      availableDate:body.availableDate
  }

})
return NextResponse.json(mentors);}



}
