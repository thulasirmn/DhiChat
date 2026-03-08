import { NextRequest, NextResponse } from "next/server";
import { connectInstagramAccount, connectInstagramInputSchema } from "@/lib/services/instagram-auth";
import { requireSession } from "@/lib/services/auth";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await requireSession();
  const body = connectInstagramInputSchema.parse(await request.json());
  const result = await connectInstagramAccount(body);
  return NextResponse.json({ ok: true, result });
}
