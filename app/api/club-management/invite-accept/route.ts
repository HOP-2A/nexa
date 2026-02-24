import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { studentId, clubId, inviteId } = await body;

  await prisma.clubToStudents.create({
    data: {
      studentId: studentId,
      clubId: clubId,
    },
  });

  await prisma.invites.delete({
    where: {
      id: inviteId,
    },
  });

  return NextResponse.json({ message: "Success" });
}
