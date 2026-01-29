import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const ticket = await prisma.ticket.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        messages: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket nije pronađen" },
        { status: 404 }
      );
    }

    const formattedTicket = {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      author: ticket.user?.name || "Anoniman",
      createdAt: ticket.createdAt,
      messages: ticket.messages.map((msg) => ({
        id: msg.id,
        content: msg.text,
        author: msg.user?.name || "Anoniman",
        createdAt: msg.createdAt,
        likes: msg.likes,
        dislikes: msg.dislikes,
        rating: msg.rating,
        setupImage: msg.setupImage,
      })),
    };

    return NextResponse.json(formattedTicket);
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Greška pri dohvaćanju ticketa" },
      { status: 500 }
    );
  }
}
