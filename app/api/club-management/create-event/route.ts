import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    title,
    clubId,
    description,
    startingAt,
    endingAt,
    location,
    capacity,
  } = body;

  await prisma.clubEvent.create({
    data: {
      clubId: clubId,
      title: title,
      description: description,
      capacity: capacity,
      location: location,
      startingAt: new Date(startingAt),
      endingAt: new Date(endingAt),
      status: "NEW",
    },
  });

  return NextResponse.json({ message: "Success" });
}
