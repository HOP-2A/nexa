import prisma from "@/lib/prisma";
import {  NextResponse } from "next/server";


export async function GET() {  
  const mentors = await prisma.mentor.findMany();
  return NextResponse.json(mentors);

  }

