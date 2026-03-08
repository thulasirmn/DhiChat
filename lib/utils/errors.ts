export class AppError extends Error {
  public readonly statusCode: number;
  public readonly safeMessage: string;

  constructor(message: string, statusCode = 500, safeMessage = "Internal server error") {
    super(message);
    this.statusCode = statusCode;
    this.safeMessage = safeMessage;
  }
}

export function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }

  return new Error("Unknown error", { cause: error });
}
