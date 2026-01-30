import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { prisma } = await import("@/lib/prisma");

    // Generate verification code
    const crypto = await import("crypto");
    const verificationCode = crypto.randomInt(100000, 1000000).toString();
    const tokenHash = crypto
      .createHash("sha256")
      .update(verificationCode)
      .digest("hex");
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Delete existing tokens for this email
    await prisma.verificationToken.deleteMany({
      where: { identifier: session.user.email },
    });

    // Create new verification token
    await prisma.verificationToken.create({
      data: {
        identifier: session.user.email,
        token: tokenHash,
        expires,
      },
    });

    // Send verification email
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    try {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const verifyUrl = `${process.env.AUTH_URL || process.env.NEXTAUTH_URL || "https://pc-builder-delta.vercel.app"}/auth/verify?email=${encodeURIComponent(
        session.user.email
      )}`;
      const fromEmail = process.env.RESEND_FROM || "PC Builder <onboarding@resend.dev>";

      await resend.emails.send({
        from: fromEmail,
        to: session.user.email,
        subject: "Potvrdi svoj email kodom",
        html: `
          <h2>Potvrda email adrese</h2>
          <p>Hvala što si zatražio verifikaciju email adrese. Tvoj verifikacijski kod je:</p>
          <p style="font-size: 24px; font-weight: bold; letter-spacing: 3px;">${verificationCode}</p>
          <p>Unesi kod na stranici za verifikaciju:</p>
          <a href="${verifyUrl}">Otvori verifikaciju</a>
          <p>Kod je valjan 15 minuta.</p>
          <p>Ako nisi tražio ovaj email, ignoriši ga.</p>
        `,
      });

      return NextResponse.json(
        { message: "Verification email sent successfully" },
        { status: 200 }
      );
    } catch (emailError) {
      console.error("Email send error:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
