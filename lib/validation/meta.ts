import { z } from "zod";

export const metaWebhookChallengeSchema = z.object({
  "hub.mode": z.string(),
  "hub.verify_token": z.string(),
  "hub.challenge": z.string()
});

const valueSchema = z.object({
  id: z.string(),
  text: z.string().optional(),
  from: z
    .object({
      id: z.string(),
      username: z.string().optional()
    })
    .optional(),
  media: z
    .object({
      id: z.string().optional(),
      media_type: z.string().optional()
    })
    .optional(),
  timestamp: z.string().optional()
});

const changeSchema = z.object({
  field: z.string(),
  value: valueSchema.passthrough()
});

const messagingSchema = z.object({
  sender: z.object({ id: z.string() }),
  recipient: z.object({ id: z.string() }),
  timestamp: z.number(),
  message: z
    .object({
      mid: z.string(),
      text: z.string().optional()
    })
    .partial()
});

const entrySchema = z.object({
  id: z.string(),
  time: z.number().optional(),
  changes: z.array(changeSchema).optional(),
  messaging: z.array(messagingSchema).optional()
});

export const metaWebhookEventSchema = z.object({
  object: z.string(),
  entry: z.array(entrySchema)
});

export type MetaWebhookEvent = z.infer<typeof metaWebhookEventSchema>;
