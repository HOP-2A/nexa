import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
  const createdCourse = await prisma.course.create({
    data:{
        courseTitle:body.courseTitle,
        courseInfo:body.courseInfo,
        paymentValue:body.paymentValue,
        mentorId:body.mentorId
    }
  });
  return NextResponse.json(createdCourse);
}
