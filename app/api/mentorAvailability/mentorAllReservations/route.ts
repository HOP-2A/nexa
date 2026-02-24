import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
const body = await req.json()
const allDates =  await prisma.mentorAvailability.findMany({
where:{
 
mentorId:body.mentorId,
status:"PENDING"
},
include:{
student:true
}
})
return NextResponse.json(allDates);


}
