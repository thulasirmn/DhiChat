import { z } from "zod";

export const connectInstagramInputSchema = z.object({
  code: z.string().min(1),
  redirectUri: z.string().url()
});

export const disconnectInstagramInputSchema = z.object({
  accountId: z.string().min(1)
});

export async function connectInstagramAccount(input: z.infer<typeof connectInstagramInputSchema>) {
  // TODO: Exchange authorization code for long-lived access token via Meta Graph API.
  return {
    accountId: `ig_${crypto.randomUUID()}`,
    handle: "new.connected.account",
    status: "connected" as const,
    receivedCode: input.code
  };
}

export async function disconnectInstagramAccount(input: z.infer<typeof disconnectInstagramInputSchema>) {
  // TODO: Revoke token and mark account as disconnected/expired in Convex.
  return {
    accountId: input.accountId,
    status: "disconnected" as const
  };
}
