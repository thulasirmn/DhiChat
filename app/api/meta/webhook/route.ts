import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRequestContext } from "@/lib/utils/request-context";
import { AppError, toError } from "@/lib/utils/errors";
import { logger } from "@/lib/utils/logger";
import { env } from "@/lib/utils/env";
import { isValidMetaSignature } from "@/lib/security/meta-signature";
import { metaWebhookChallengeSchema } from "@/lib/validation/meta";
import { handleMetaWebhook, validateVerifyToken } from "@/lib/services/handle-meta-webhook";

const querySchema = metaWebhookChallengeSchema;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const query = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = querySchema.safeParse(query);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid challenge query" }, { status: 400 });
  }

  const { "hub.mode": mode, "hub.verify_token": verifyToken, "hub.challenge": challenge } = parsed.data;

  if (mode !== "subscribe" || !validateVerifyToken(verifyToken)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return new NextResponse(challenge, { status: 200 });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const context = createRequestContext(request.headers.get("x-correlation-id"));

  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-hub-signature-256");

    if (!isValidMetaSignature(rawBody, signature, env.META_APP_SECRET)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(rawBody) as unknown;
    const result = await handleMetaWebhook(payload, context.correlationId);

    return NextResponse.json(
      {
        ok: true,
        accepted: result.accepted,
        correlationId: context.correlationId
      },
      { status: 200 }
    );
  } catch (error) {
    const safeError = toError(error);

    logger.error("meta_webhook_error", {
      correlationId: context.correlationId,
      message: safeError.message
    });

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          error: error.safeMessage,
          correlationId: context.correlationId
        },
        { status: error.statusCode }
      );
    }

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid webhook payload", correlationId: context.correlationId }, { status: 400 });
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        correlationId: context.correlationId
      },
      { status: 500 }
    );
  }
}
