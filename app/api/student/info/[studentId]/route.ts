import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ studentId: string }> },
) {
  const { studentId } = await context.params;

  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      clubToStudents: {
        include: {
          Club: {
            include: {
              events: true,
            },
          },
        },
      },
    },
  });

  return NextResponse.json(student);
}
