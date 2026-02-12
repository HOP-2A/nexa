import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  {
    params,
  }: {
    params: { clubId: string };
  },
) {
  const { clubId } = await params;

  const forms = await prisma.clubForm.findMany({
    where: {
      clubId: clubId,
    },

    include: {
      student: true,
    },
  });

  return NextResponse.json(forms);
}
