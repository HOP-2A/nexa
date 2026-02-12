import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { studentClerk, clubId } = body;

    if (!studentClerk || !clubId) {
      return NextResponse.json(
        { error: "Missing studentClerk or clubId" },
        { status: 400 },
      );
    }

    const student = await prisma.student.findFirst({
      where: {
        clerkId: studentClerk,
      },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const result = await prisma.clubToStudents.create({
      data: {
        clubId,
        studentId: student.id,
      },
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
