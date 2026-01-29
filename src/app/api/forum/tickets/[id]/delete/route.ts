import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Potrebna je prijava" },
        { status: 401 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: { user: { select: { email: true } } },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket nije pronađen" },
        { status: 404 }
      );
    }

    if (ticket.user?.email !== session.user.email) {
      return NextResponse.json(
        { error: "Nemaš dozvolu za brisanje" },
        { status: 403 }
      );
    }

    await prisma.ticket.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Ticket je obrisan" });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    return NextResponse.json(
      { error: "Greška pri brisanju ticketa" },
      { status: 500 }
    );
  }
}
