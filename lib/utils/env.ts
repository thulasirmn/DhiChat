import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  META_VERIFY_TOKEN: z.string().min(1).default("local-dev-token"),
  META_APP_SECRET: z.string().min(1).default("local-dev-secret"),
  META_GRAPH_API_VERSION: z.string().default("v22.0"),
  META_GRAPH_BASE_URL: z.string().url().default("https://graph.facebook.com"),
  OPENAI_API_KEY: z.string().optional()
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  META_VERIFY_TOKEN: process.env.META_VERIFY_TOKEN,
  META_APP_SECRET: process.env.META_APP_SECRET,
  META_GRAPH_API_VERSION: process.env.META_GRAPH_API_VERSION,
  META_GRAPH_BASE_URL: process.env.META_GRAPH_BASE_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY
});
