import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ clubId: string }>;
  },
) {
  const { clubId } = await params;

  const clubInfo = await prisma.club.findFirst({
    where: {
      id: clubId,
    },

    include: {
      events: true,
      clubToStudents: {
        include: {
          Student: true,
        },
      },
    },
  });

  return NextResponse.json(clubInfo);
}
