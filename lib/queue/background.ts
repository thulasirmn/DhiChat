import { logger } from "@/lib/utils/logger";

export type Job<T> = {
  name: string;
  run: () => Promise<T>;
  retries?: number;
};

export async function runWithRetry<T>(job: Job<T>): Promise<T> {
  const maxAttempts = (job.retries ?? 2) + 1;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await job.run();
    } catch (error) {
      lastError = error;
      logger.warn("background_job_attempt_failed", {
        job: job.name,
        attempt,
        maxAttempts,
        error: error instanceof Error ? error.message : "unknown"
      });
    }
  }

  logger.error("background_job_exhausted", { job: job.name });
  throw lastError;
}
