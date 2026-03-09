import { ConvexHttpClient } from "convex/browser";

let cachedClient: ConvexHttpClient | null = null;

export function getConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;

  if (!url) {
    return null;
  }

  if (!cachedClient) {
    cachedClient = new ConvexHttpClient(url);
  }

  return cachedClient;
}
