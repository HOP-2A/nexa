import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { studentId: string } }){
    const { studentId } = await params;

    const student = await prisma.student.findFirst({
        where: {
            clerkId: studentId
        },

        include: {
            clubToStudents: {
                include: {
                    Club: {
                        include: {
                            events: true
                        }
                    }
                }
            }
        }
    })

    return NextResponse.json(student);
}