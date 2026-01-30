import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; messageId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Potrebna je prijava" }, { status: 401 });
    }

    const { type } = await req.json(); // "like" or "dislike"
    if (type !== "like" && type !== "dislike") {
      return NextResponse.json({ error: "Neispravan tip" }, { status: 400 });
    }
    const { prisma } = await import("@/lib/prisma");

    const message = await prisma.message.findUnique({
      where: { id: params.messageId },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Poruka nije pronađena" },
        { status: 404 }
      );
    }

    const existing = await prisma.messageReaction.findUnique({
      where: {
        messageId_userId: {
          messageId: params.messageId,
          userId: session.user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Već ste reagovali na ovu poruku" },
        { status: 409 }
      );
    }

    await prisma.messageReaction.create({
      data: {
        messageId: params.messageId,
        userId: session.user.id,
        type,
      },
    });

    const [likesCount, dislikesCount] = await Promise.all([
      prisma.messageReaction.count({
        where: { messageId: params.messageId, type: "like" },
      }),
      prisma.messageReaction.count({
        where: { messageId: params.messageId, type: "dislike" },
      }),
    ]);

    const updatedMessage = await prisma.message.update({
      where: { id: params.messageId },
      data: { likes: likesCount, dislikes: dislikesCount },
    });

    return NextResponse.json({
      likes: updatedMessage.likes,
      dislikes: updatedMessage.dislikes,
    });
  } catch (error) {
    console.error("Error liking message:", error);
    return NextResponse.json(
      { error: "Greška pri ocjenjivanju" },
      { status: 500 }
    );
  }
}
