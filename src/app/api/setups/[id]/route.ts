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

    const setup = await prisma.setup.findUnique({
      where: { id: params.id },
      include: {
        user: { select: { name: true } },
        comments: {
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!setup) {
      return NextResponse.json(
        { error: "Setup nije pronađen" },
        { status: 404 }
      );
    }

    const formattedSetup = {
      id: setup.id,
      userId: setup.userId,
      title: setup.title,
      description: setup.description,
      image: setup.image,
      author: setup.user?.name || "Anoniman",
      createdAt: setup.createdAt,
      rating: setup.rating,
      likes: setup.likes,
      dislikes: setup.dislikes,
      comments: setup.comments.map((comment) => ({
        id: comment.id,
        userId: comment.userId,
        text: comment.text,
        author: comment.user?.name || "Anoniman",
        createdAt: comment.createdAt,
        likes: comment.likes,
        dislikes: comment.dislikes,
        rating: comment.rating,
      })),
    };

    return NextResponse.json(formattedSetup);
  } catch (error) {
    console.error("Error fetching setup:", error);
    return NextResponse.json(
      { error: "Greška pri dohvaćanju setupa" },
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

    const setup = await prisma.setup.findUnique({
      where: { id: params.id },
      include: { user: { select: { email: true } } },
    });

    if (!setup) {
      return NextResponse.json(
        { error: "Setup nije pronađen" },
        { status: 404 }
      );
    }

    if (setup.user?.email !== session.user.email) {
      return NextResponse.json(
        { error: "Nemaš dozvolu za brisanje" },
        { status: 403 }
      );
    }

    await prisma.setup.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Setup je obrisan" });
  } catch (error) {
    console.error("Error deleting setup:", error);
    return NextResponse.json(
      { error: "Greška pri brisanju setupa" },
      { status: 500 }
    );
  }
}
