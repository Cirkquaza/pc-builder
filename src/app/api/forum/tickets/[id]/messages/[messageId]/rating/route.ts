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

    const { rating } = await req.json(); // 0.0 to 10.0

    if (typeof rating !== "number" || rating < 0 || rating > 10) {
      return NextResponse.json(
        { error: "Rejting mora biti između 0 i 10" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const existing = await prisma.messageRating.findUnique({
      where: {
        messageId_userId: {
          messageId: params.messageId,
          userId: session.user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Rejting se može dati samo jednom" },
        { status: 409 }
      );
    }

    await prisma.messageRating.create({
      data: {
        messageId: params.messageId,
        userId: session.user.id,
        rating,
      },
    });

    const aggregate = await prisma.messageRating.aggregate({
      where: { messageId: params.messageId },
      _avg: { rating: true },
    });

    const updatedMessage = await prisma.message.update({
      where: { id: params.messageId },
      data: { rating: aggregate._avg.rating ?? 0 },
    });

    return NextResponse.json({ rating: updatedMessage.rating });
  } catch (error) {
    console.error("Error rating message:", error);
    return NextResponse.json(
      { error: "Greška pri postavljanju rejtinga" },
      { status: 500 }
    );
  }
}
