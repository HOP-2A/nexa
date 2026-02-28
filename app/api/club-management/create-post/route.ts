import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { clubId, studentClerk, title, content, image } = await body;

  const student = await prisma.student.findFirst({
    where: {
      clerkId: studentClerk,
    },
  });

  if (!student) return;

  await prisma.post.create({
    data: {
      clubId: clubId,
      studentId: student?.id,
      title: title,
      content: content,
      image: [image],
    },
  });

  return NextResponse.json({ message: "Success" });
}
