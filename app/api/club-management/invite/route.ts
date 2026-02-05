import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, code, clerk } = body;

  const inviter = await prisma.student.findFirst({
    where: {
      clerkId: clerk,
    },
  });

  await prisma.invites.create({
    data: {
      studentEmail: email,
      code: code,
      inviterId: inviter?.id!,
    },
  });

  return NextResponse.json({ messgae: "Success" });
}
