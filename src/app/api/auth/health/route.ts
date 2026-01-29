import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  let dbOk = false;
  let dbError: string | null = null;

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.user.count();
    dbOk = true;
  } catch (error) {
    dbOk = false;
    dbError = error instanceof Error ? error.message : "Unknown DB error";
  }

  return NextResponse.json({
    hasAuthSecret: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    hasAuthUrl: Boolean(process.env.AUTH_URL || process.env.NEXTAUTH_URL),
    hasPostgresUrl: Boolean(process.env.POSTGRES_URL),
    nodeEnv: process.env.NODE_ENV,
    dbOk,
    dbError,
  });
}
