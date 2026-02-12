import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ studentId: string }>;
  },
) {
  const { studentId } = await params;
  const clubuud = await prisma.club.findMany({
    where: {
      clubToStudents: {
        none: {
          studentId: studentId,
        },
      },
    },

    include: {
      clubToStudents: true,
    },
  });

  return NextResponse.json(clubuud);
}
