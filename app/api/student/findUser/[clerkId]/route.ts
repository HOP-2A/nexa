import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ clerkId: string }> }
) {
  const { clerkId } = await params;
  const students = await prisma.student.findUnique({
    where: { clerkId },
  });
  if(!students){
    const mentor = await prisma.mentor.findUnique({
      where: { clerkId },
    });
    return NextResponse.json(mentor);
  }

  return NextResponse.json(students);


}
