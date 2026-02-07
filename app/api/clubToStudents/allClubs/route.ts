import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
 
export async function GET() {
  const clubs = await prisma.club.findMany({
   include: {
    clubToStudents: true
   }
 });
 
  return NextResponse.json(clubs);
}