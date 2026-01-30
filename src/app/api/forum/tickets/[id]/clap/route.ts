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

    const { prisma } = await import("@/lib/prisma");

    const existing = await prisma.ticketClap.findUnique({
      where: {
        ticketId_userId: {
          ticketId: params.id,
          userId: session.user.id,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Već ste tapkali ovaj ticket" },
        { status: 409 }
      );
    }

    await prisma.ticketClap.create({
      data: {
        ticketId: params.id,
        userId: session.user.id,
      },
    });

    const clapsCount = await prisma.ticketClap.count({
      where: { ticketId: params.id },
    });

    const updatedTicket = await prisma.ticket.update({
      where: { id: params.id },
      data: { claps: clapsCount },
    });

    return NextResponse.json({ claps: updatedTicket.claps });
  } catch (error) {
    console.error("Error clapping ticket:", error);
    return NextResponse.json(
      { error: "Greška pri tapkanju" },
      { status: 500 }
    );
  }
}
