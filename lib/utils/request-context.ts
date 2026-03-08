export function createRequestContext(incomingId?: string | null): { correlationId: string } {
  return {
    correlationId: incomingId ?? crypto.randomUUID()
  };
}
