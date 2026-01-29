import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Potrebna je prijava" },
        { status: 401 }
      );
    }

    const { type } = await req.json();

    const { prisma } = await import("@/lib/prisma");

    const comment = await prisma.setupComment.findUnique({
      where: { id: params.commentId },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Komentar nije pronađen" },
        { status: 404 }
      );
    }

    let updateData = {};
    if (type === "like") {
      updateData = { likes: comment.likes + 1 };
    } else if (type === "dislike") {
      updateData = { dislikes: comment.dislikes + 1 };
    }

    const updatedComment = await prisma.setupComment.update({
      where: { id: params.commentId },
      data: updateData,
    });

    return NextResponse.json({
      likes: updatedComment.likes,
      dislikes: updatedComment.dislikes,
    });
  } catch (error) {
    console.error("Error liking comment:", error);
    return NextResponse.json(
      { error: "Greška pri ocjenjivanju" },
      { status: 500 }
    );
  }
}
