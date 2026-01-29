import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
	const { handlers } = await import("@/lib/auth");
	return handlers.GET(request);
}

export async function POST(request: NextRequest) {
	const { handlers } = await import("@/lib/auth");
	return handlers.POST(request);
}
