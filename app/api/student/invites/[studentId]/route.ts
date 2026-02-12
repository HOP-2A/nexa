import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { studentId: string };
  },
) {
  const { studentId } = await params;
  const student = await prisma.student.findFirst({
    where: {
      id: studentId,
    },
  });

  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  const invites = await prisma.invites.findMany({
    where: {
      studentEmail: student?.email,
    },
    include: {
      Student: {
        include: {
          clubToStudents: {
            include: {
              Club: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(invites);
}
