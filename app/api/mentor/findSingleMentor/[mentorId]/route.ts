import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ mentorId: string }>}
) {
  const { mentorId } = await params;
  const mentors = await prisma.mentor.findFirst({where:{id:mentorId}})
  return NextResponse.json(mentors);


}
