import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest
) {
const body = await req.json()
const allDates =  await prisma.mentorAvailability.update({
    where:{
        id:body.id
    },
    data:{
        studentId:body.studentId,
        status:"PENDING"

    }
}

)
return NextResponse.json(allDates);


}
