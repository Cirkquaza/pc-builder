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

    const { rating } = await req.json();

    if (typeof rating !== "number" || rating < 0 || rating > 10) {
      return NextResponse.json(
        { error: "Rejting mora biti između 0 i 10" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const updatedComment = await prisma.setupComment.update({
      where: { id: params.commentId },
      data: { rating },
    });

    return NextResponse.json({ rating: updatedComment.rating });
  } catch (error) {
    console.error("Error rating comment:", error);
    return NextResponse.json(
      { error: "Greška pri postavljanju rejtinga" },
      { status: 500 }
    );
  }
}
