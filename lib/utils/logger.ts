type Metadata = Record<string, unknown>;

export type LogLevel = "info" | "warn" | "error";

function writeLog(level: LogLevel, message: string, metadata: Metadata = {}): void {
  const payload = {
    ts: new Date().toISOString(),
    level,
    message,
    ...metadata
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
    return;
  }

  console.log(JSON.stringify(payload));
}

export const logger = {
  info: (message: string, metadata?: Metadata) => writeLog("info", message, metadata),
  warn: (message: string, metadata?: Metadata) => writeLog("warn", message, metadata),
  error: (message: string, metadata?: Metadata) => writeLog("error", message, metadata)
};
