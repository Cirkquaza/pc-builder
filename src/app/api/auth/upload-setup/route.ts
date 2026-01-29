import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Potrebna je prijava" },
        { status: 401 }
      );
    }

    const { setupImage } = await req.json();

    if (!setupImage) {
      return NextResponse.json(
        { error: "Slika je obavezna" },
        { status: 400 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { setupImage },
    });

    return NextResponse.json({
      message: "Slika je uspješno učitana",
      setupImage: updatedUser.setupImage,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Greška pri učitavanju slike" },
      { status: 500 }
    );
  }
}
