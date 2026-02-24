import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { studentClerk, clubId } = await body;

  const student = await prisma.student.findFirst({
    where: {
      clerkId: studentClerk,
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const form = await prisma.clubForm.findFirst({
    where: {
      studentId: student?.id,
      clubId: clubId,
    },
  });

  return NextResponse.json(form);
}
