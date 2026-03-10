import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
const body = await req.json()
const allDates =  await prisma.mentorAvailability.findMany({
where:{
 studentId:body.studentId,
 status:"BOOKED"
},
include:{
  student:true
}
})
return NextResponse.json(allDates);


}
