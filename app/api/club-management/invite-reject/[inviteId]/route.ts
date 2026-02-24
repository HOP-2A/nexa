import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  {
    params,
  }: {
    params: Promise<{ inviteId: string }>;
  },
) {
  const { inviteId } = await params;

  console.log("hahahaha");
  await prisma.invites.delete({
    where: {
      id: inviteId,
    },
  });
  return NextResponse.json({ message: "SUCCESS" });
}
