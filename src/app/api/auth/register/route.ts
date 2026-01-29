import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const [{ prisma }, bcrypt] = await Promise.all([
      import("@/lib/prisma"),
      import("bcryptjs"),
    ]);

    const { email, password, name } = await req.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Hash password
    const hashFn = bcrypt.hash ?? (bcrypt.default && bcrypt.default.hash);
    
    if (!hashFn) {
      console.error("bcrypt.hash not available");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    const hashedPassword = await hashFn(password, 10);

    // Create user (not verified yet)
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        emailVerified: null,
      },
    });

    // Generate verification token
    const crypto = await import("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    // Send verification email
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        const verifyUrl = `${process.env.AUTH_URL || process.env.NEXTAUTH_URL || "https://pc-builder-delta.vercel.app"}/auth/verify?token=${token}`;

        await resend.emails.send({
          from: "PC Builder <onboarding@resend.dev>",
          to: email,
          subject: "Potvrdi svoj email",
          html: `
            <h2>Dobrodošao u PC Builder!</h2>
            <p>Hvala što si se registrovao. Klikni na link ispod da potvrdiš svoj email:</p>
            <a href="${verifyUrl}">Potvrdi email</a>
            <p>Link je valjan 24 sata.</p>
            <p>Ako nisi tražio ovaj email, ignoriši ga.</p>
          `,
        });
      } catch (emailError) {
        console.error("Email send error:", emailError);
      }
    }

    return NextResponse.json(
      { message: "Registration successful. Check your email to verify your account.", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error", details: errorMessage },
      { status: 500 }
    );
  }
}
