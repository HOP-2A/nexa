import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { formId } = await body;

  const form = await prisma.clubForm.update({
    where: {
      id: formId,
    },
    data: {
      status: "ACCEPTED",
    },
  });

  if (!form) return;

  await prisma.clubToStudents.create({
    data: {
      studentId: form.studentId,
      clubId: form.clubId,
    },
  });

  return NextResponse.json({ message: "SUCCESS" });
}
