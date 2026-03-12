import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const clubId = formData.get("clubId") as string;
    const studentClerk = formData.get("studentClerk") as string;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    const file = formData.get("file") as File | null;

    let imageUrl: string | null = null;

    // ✅ upload to blob
    if (file) {
      const blob = await put(`clubs/${Date.now()}-${file.name}`, file, {
        access: "public",
      });

      imageUrl = blob.url;
    }

    const student = await prisma.student.findFirst({
      where: { clerkId: studentClerk },
    });

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    await prisma.post.create({
      data: {
        clubId,
        studentId: student.id,
        title,
        content,
        image: imageUrl ? [imageUrl] : [],
      },
    });

    return NextResponse.json({ message: "Success" });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}