import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { processAutomationEvent } from "@/lib/services/process-automation-event";
import { normalizedEventSchema } from "@/lib/validation/automation";
import { requireSession } from "@/lib/services/auth";

const processSchema = z.object({
  event: normalizedEventSchema
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  await requireSession();
  const payload = processSchema.parse(await request.json());
  const result = await processAutomationEvent(payload.event);

  return NextResponse.json({ ok: true, result });
}
