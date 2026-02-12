import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { clubId: string } }
) {
    const {clubId} = await params ;

  const club = await prisma.club.findFirst({
    where: {
      id: clubId,
    },
    include: {
      clubToStudents: true,
      events: true,
    },
  });

  return NextResponse.json(club);
}

// import prisma from "@/lib/prisma";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET(
//   req: NextRequest,
//   { params }: { params: { clubId: string } }
// ) {
//   const club = await prisma.club.findUnique({
//     where: {
//       id: params.clubId,
//     },
//     include: {
//       clubToStudents: true,
//       events: true,
//     },
//   });

//   return NextResponse.json(club);
// }
