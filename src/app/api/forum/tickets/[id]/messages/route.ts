import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { content } = await req.json();
    const { auth } = await import("@/lib/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Morate biti prijavljeni" },
        { status: 401 }
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Komentar ne može biti prazan" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const message = await prisma.message.create({
      data: {
        text: content,
        ticketId: params.id,
        userId: session.user.id,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Greška pri slanju komentara" },
      { status: 500 }
    );
  }
}
