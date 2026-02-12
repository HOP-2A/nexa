import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    clubId,
    studentClerk,
    age,
    clasS,
    personal,
    experience,
    skills,
    why,
  } = body;

  const student = await prisma.student.findFirst({
    where: {
      clerkId: studentClerk,
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  await prisma.clubForm.create({
    data: {
      clubId: clubId,
      studentId: student?.id,
      age: Number(age),
      skills: skills,
      class: clasS,
      personalStatement: personal,
      experience: experience,
      whyThisClub: why,
    },
  });

  return NextResponse.json({ meassage: "Success" }, { status: 200 });
}
