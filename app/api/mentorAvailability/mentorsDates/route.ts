import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
const body = await req.json()
if(body.date === undefined){
  return NextResponse.json("select your date");
}
else{
const allDates =  await prisma.mentorAvailability.findMany({
where:{
  courseId:body.courseId,
  availableDate:body.date,
  status:"AVAILABLE"
}
})
return NextResponse.json(allDates);
}

}
