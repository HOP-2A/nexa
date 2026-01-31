import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";

export async function POST(req: NextRequest){
    const body = await req.json();
    const {name, president, description} = body;


    const nanoid4 = customAlphabet("0123456789", 4);
    const code = nanoid4()

    const createdClub = await prisma.club.create({
        data: {
            name: name,
            presidentId: president,
            description: description,
            code: code
        }
    })

    await prisma.clubToStudents.create({
        data: {
            studentId: president,
            clubId: createdClub?.id
        }
    })

    return NextResponse.json({message: "Success"})
}