import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ clubId: string }> },
) {
  const { clubId } = await context.params;

  const forms = await prisma.clubForm.findMany({
    where: { clubId },
    include: { student: true },
  });

  return NextResponse.json(forms);
}
