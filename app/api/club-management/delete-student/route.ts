import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { studentId, reason, clubId } = body;

  const clubTostudent = await prisma.clubToStudents.findFirst({
    where: {
      studentId: studentId,
      clubId: clubId,
    },
  });

  await prisma.clubToStudents.delete({
    where: {
      id: clubTostudent?.id,
    },
  });

  return NextResponse.json({ message: "Success" });
}
