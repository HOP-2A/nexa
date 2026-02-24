import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ formId: string }>;
  },
) {
  const { formId } = await params;

  await prisma.clubForm.update({
    where: {
      id: formId,
    },
    data: {
      status: "REJECTED",
    },
  });

  return NextResponse.json("Success");
}
