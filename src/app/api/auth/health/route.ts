import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    hasAuthSecret: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    hasAuthUrl: Boolean(process.env.AUTH_URL || process.env.NEXTAUTH_URL),
    nodeEnv: process.env.NODE_ENV,
  });
}
