import crypto from "node:crypto";

const AES_ALGORITHM = "aes-256-gcm";

function getKey(secret: string): Buffer {
  return Buffer.from(secret.padEnd(32, "0").slice(0, 32), "utf8");
}

export function encryptSecret(value: string, secret: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(AES_ALGORITHM, getKey(secret), iv);

  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return [Buffer.from(iv).toString("hex"), authTag.toString("hex"), encrypted.toString("hex")].join(":");
}

export function decryptSecret(payload: string, secret: string): string {
  const [ivHex, tagHex, encryptedHex] = payload.split(":");

  if (!ivHex || !tagHex || !encryptedHex) {
    throw new Error("Malformed encrypted payload");
  }

  const decipher = crypto.createDecipheriv(AES_ALGORITHM, getKey(secret), Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final()
  ]);

  return decrypted.toString("utf8");
}
