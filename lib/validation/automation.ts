import { z } from "zod";

export const normalizedEventSchema = z.object({
  idempotencyKey: z.string(),
  channel: z.enum(["comment", "dm"]),
  accountId: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  senderHandle: z.string().optional(),
  text: z.string().default(""),
  timestamp: z.string(),
  raw: z.record(z.unknown())
});

export const intentResultSchema = z.object({
  intent: z.enum(["lead", "support", "spam", "unknown"]),
  confidence: z.number().min(0).max(1),
  riskFlags: z.array(z.string()),
  language: z.string().default("en")
});

export const replyCandidateSchema = z.object({
  text: z.string().min(1),
  rationale: z.string().min(1),
  promptVersion: z.string().default("v1")
});

export type NormalizedEvent = z.infer<typeof normalizedEventSchema>;
export type IntentResult = z.infer<typeof intentResultSchema>;
export type ReplyCandidate = z.infer<typeof replyCandidateSchema>;
