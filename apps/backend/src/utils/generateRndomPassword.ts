import crypto from "crypto";

export function generateRandomPassword(length: number = 12): string {
  return crypto
    .randomBytes(length)
    .toString("base64")
    .slice(0, length)
    .replace(/[+/=]/g, "A"); // Replace potentially problematic characters
}
