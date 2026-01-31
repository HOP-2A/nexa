import  prisma  from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
export const GET = () => {
  return NextResponse.json("hi");
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstname,lastname, email, password, role } = body;

  const existingMentor= await prisma.mentor.findFirst({
    where: {
      email: email,
    },
  });

  const existingStudent = await prisma.student.findFirst({
    where: {
      email: email,
    },
  });

  if (existingMentor || existingStudent) {
    throw new Error("User exists");
  }

  const clerk = await clerkClient();
  const createdClerkUser = await clerk.users.createUser({
    skipPasswordChecks: true,
    skipPasswordRequirement: true,
    emailAddress: [email],
    password,
    firstName: firstname,
    publicMetadata: {
      role: role,
    },
  });

  if (role === "MENTOR") {
    const createdUser = await prisma.mentor.create({
      data: {
        clerkId: createdClerkUser.id,
        email,
        firstname:firstname,
        lastname:lastname,
        
      },
    });
    return NextResponse.json(createdUser);
  }


  if (role === "STUDENT") {
    const createdUser = await prisma.student.create({
      data: {
        clerkId: createdClerkUser.id,
        email,
        firstname:firstname,
        lastname:lastname,
      },
    });

    return NextResponse.json(createdUser);
  }
}
