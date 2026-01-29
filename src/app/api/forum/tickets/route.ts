import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");

    const tickets = await prisma.ticket.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        createdAt: true,
        user: {
          select: {
            name: true,
          },
        },
        messages: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedTickets = tickets.map((ticket) => ({
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      author: ticket.user?.name || "Anoniman",
      createdAt: ticket.createdAt,
      comments: ticket.messages.length,
      likes: 0,
    }));

    return NextResponse.json(formattedTickets);
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Greška pri dohvaćanju ticketa" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { title, description } = await req.json();
    const { auth } = await import("@/lib/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Morate biti prijavljeni" },
        { status: 401 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: "Naslov i opis su obavezni" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        userId: session.user.id,
      },
    });

    return NextResponse.json(ticket, { status: 201 });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Greška pri kreiranju ticketa" },
      { status: 500 }
    );
  }
}
