import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json()
  const mentors = await prisma.mentor.update({
where:{
  id:body.id
},
data:{
    rating:body.rating
}
  });
  return NextResponse.json(mentors);
}
