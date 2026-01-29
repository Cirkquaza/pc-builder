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
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Potrebna je prijava" }, { status: 401 });
    }

    const { type } = await req.json(); // "like" or "dislike"
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

    let updateData = {};
    if (type === "like") {
      updateData = { likes: message.likes + 1 };
    } else if (type === "dislike") {
      updateData = { dislikes: message.dislikes + 1 };
    }

    const updatedMessage = await prisma.message.update({
      where: { id: params.messageId },
      data: updateData,
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
