import crypto from "node:crypto";

export function isValidMetaSignature(body: string, signatureHeader: string | null, appSecret: string): boolean {
  if (!signatureHeader) {
    return false;
  }

  const expected = `sha256=${crypto.createHmac("sha256", appSecret).update(body).digest("hex")}`;
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signatureHeader);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}
