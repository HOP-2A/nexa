import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mentorId: string }>}
) {
  const { mentorId } = await params;
  const mentors = await prisma.course.findMany({where:{mentorId:mentorId}})
  return NextResponse.json(mentors);


}
