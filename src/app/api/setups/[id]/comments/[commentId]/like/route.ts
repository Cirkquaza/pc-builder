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
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Potrebna je prijava" },
        { status: 401 }
      );
    }

    const { type } = await req.json();
    if (type !== "like" && type !== "dislike") {
      return NextResponse.json(
        { error: "Neispravan tip" },
        { status: 400 }
      );
    }

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

    const existing = await prisma.setupCommentReaction.findUnique({
      where: {
        commentId_userId: {
          commentId: params.commentId,
          userId: session.user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Već ste reagovali na ovaj komentar" },
        { status: 409 }
      );
    }

    await prisma.setupCommentReaction.create({
      data: {
        commentId: params.commentId,
        userId: session.user.id,
        type,
      },
    });

    const [likesCount, dislikesCount] = await Promise.all([
      prisma.setupCommentReaction.count({
        where: { commentId: params.commentId, type: "like" },
      }),
      prisma.setupCommentReaction.count({
        where: { commentId: params.commentId, type: "dislike" },
      }),
    ]);

    const updatedComment = await prisma.setupComment.update({
      where: { id: params.commentId },
      data: { likes: likesCount, dislikes: dislikesCount },
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
