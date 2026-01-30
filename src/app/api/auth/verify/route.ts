import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { prisma } = await import("@/lib/prisma");
    const crypto = await import("crypto");
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email i kod su obavezni" },
        { status: 400 }
      );
    }

    const tokenHash = crypto
      .createHash("sha256")
      .update(String(code))
      .digest("hex");

    // Find verification token
    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: email,
        token: tokenHash,
      },
    });

    if (!verificationToken) {
      return NextResponse.json(
        { error: "Neispravan token" },
        { status: 400 }
      );
    }

    // Check if token expired
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token: verificationToken.token },
      });
      return NextResponse.json(
        { error: "Token je istekao" },
        { status: 400 }
      );
    }

    // Update user to verified
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // Delete used token
    await prisma.verificationToken.delete({
      where: { token: verificationToken.token },
    });

    return NextResponse.json(
      { message: "Email uspješno potvrđen" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Greška pri verifikaciji" },
      { status: 500 }
    );
  }
}
