import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Potrebna je prijava" }, { status: 401 });
    }

    const { rating } = await req.json();

    if (typeof rating !== "number" || rating < 0 || rating > 10) {
      return NextResponse.json(
        { error: "Rejting mora biti između 0 i 10" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    // Allow update if user already voted
    await prisma.ticketRating.upsert({
      where: {
        ticketId_userId: {
          ticketId: params.id,
          userId: session.user.id,
        },
      },
      create: {
        ticketId: params.id,
        userId: session.user.id,
        rating,
      },
      update: {
        rating,
      },
    });

    const aggregate = await prisma.ticketRating.aggregate({
      where: { ticketId: params.id },
      _avg: { rating: true },
    });

    const updatedTicket = await prisma.ticket.update({
      where: { id: params.id },
      data: { rating: aggregate._avg.rating ?? 0 },
    });

    return NextResponse.json({ rating: updatedTicket.rating });
  } catch (error) {
    console.error("Error rating ticket:", error);
    return NextResponse.json(
      { error: "Greška pri postavljanju rejtinga" },
      { status: 500 }
    );
  }
}
