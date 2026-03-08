import { NextRequest, NextResponse } from "next/server";
import { disconnectInstagramAccount, disconnectInstagramInputSchema } from "@/lib/services/instagram-auth";
import { requireSession } from "@/lib/services/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await requireSession();
  const body = disconnectInstagramInputSchema.parse(await request.json());
  const result = await disconnectInstagramAccount(body);
  return NextResponse.json({ ok: true, result });
}
