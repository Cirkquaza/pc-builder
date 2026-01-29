import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");

    const setups = await prisma.setup.findMany({
      include: {
        user: {
          select: { name: true, email: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedSetups = setups.map((setup) => ({
      id: setup.id,
      title: setup.title,
      description: setup.description,
      image: setup.image,
      author: setup.user?.name || "Anoniman",
      createdAt: setup.createdAt,
      rating: setup.rating,
      likes: setup.likes,
      dislikes: setup.dislikes,
      commentCount: setup._count.comments,
    }));

    return NextResponse.json(formattedSetups);
  } catch (error) {
    console.error("Error fetching setups:", error);
    return NextResponse.json(
      { error: "Greška pri učitavanju setupa" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Potrebna je prijava" },
        { status: 401 }
      );
    }

    const { title, description, image } = await req.json();

    if (!title || !image) {
      return NextResponse.json(
        { error: "Naslov i slika su obavezni" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 }
      );
    }

    const setup = await prisma.setup.create({
      data: {
        title,
        description,
        image,
        userId: user.id,
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json(
      { setup, message: "Setup je uspješno objavljen" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating setup:", error);
    return NextResponse.json(
      { error: "Greška pri kreiranju setupa" },
      { status: 500 }
    );
  }
}
