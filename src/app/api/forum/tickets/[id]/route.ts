import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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
        userId: msg.userId,
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
