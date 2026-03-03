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

  const datapost = await prisma.post.findMany({
    where: {
      clubId: clubId,
    },
  });

  return NextResponse.json(datapost);
}
