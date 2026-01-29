import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; messageId: string } }
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

    const message = await prisma.message.findUnique({
      where: { id: params.messageId },
      include: { user: { select: { email: true } } },
    });

    if (!message) {
      return NextResponse.json(
        { error: "Komentar nije pronađen" },
        { status: 404 }
      );
    }

    if (message.user?.email !== session.user.email) {
      return NextResponse.json(
        { error: "Nemaš dozvolu za brisanje" },
        { status: 403 }
      );
    }

    await prisma.message.delete({
      where: { id: params.messageId },
    });

    return NextResponse.json({ message: "Komentar je obrisan" });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json(
      { error: "Greška pri brisanju komentara" },
      { status: 500 }
    );
  }
}
