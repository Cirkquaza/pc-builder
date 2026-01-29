import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(
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

    const { prisma } = await import("@/lib/prisma");

    const comment = await prisma.setupComment.findUnique({
      where: { id: params.commentId },
      include: { user: { select: { email: true } } },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "Komentar nije pronađen" },
        { status: 404 }
      );
    }

    if (comment.user?.email !== session.user.email) {
      return NextResponse.json(
        { error: "Nemaš dozvolu za brisanje" },
        { status: 403 }
      );
    }

    await prisma.setupComment.delete({
      where: { id: params.commentId },
    });

    return NextResponse.json({ message: "Komentar je obrisan" });
  } catch (error) {
    console.error("Error deleting setup comment:", error);
    return NextResponse.json(
      { error: "Greška pri brisanju komentara" },
      { status: 500 }
    );
  }
}
