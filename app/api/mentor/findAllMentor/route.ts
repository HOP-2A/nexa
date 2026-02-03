import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const mentors = await prisma.mentor.findMany({});
  return NextResponse.json(mentors);
}
