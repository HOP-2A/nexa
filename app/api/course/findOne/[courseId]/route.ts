import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }>}
) {
  const { courseId } = await params;
  const mentors = await prisma.course.findFirst({where:{id:courseId}})
  return NextResponse.json(mentors);


}
