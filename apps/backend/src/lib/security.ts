import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import { config } from "../config";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // Standard for GCM

/**
 * Derives a 32-byte key from a secret using SHA-256.
 */
function getKey(secret: string): Buffer {
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a string using AES-256-GCM.
 */
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = getKey(config.APP_SECRET);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a string. Tries current APP_SECRET, falls back to APP_SECRET_PREVIOUS if auth fails.
 * Returns the decrypted string and a boolean indicating if it was decrypted with the previous secret.
 */
export function decrypt(encryptedData: string): {
  text: string;
  needsMigration: boolean;
} {
  // Try current APP_SECRET
  try {
    const text = decryptWithSecret(encryptedData, config.APP_SECRET);
    return { text, needsMigration: false };
  } catch (err) {
    // Fallback to APP_SECRET_PREVIOUS if it exists
    if (config.APP_SECRET_PREVIOUS) {
      try {
        const text = decryptWithSecret(
          encryptedData,
          config.APP_SECRET_PREVIOUS,
        );
        return { text, needsMigration: true };
      } catch {
        throw new Error(
          "Decryption failed with both current and previous secrets",
        );
      }
    }
    throw err;
  }
}

function decryptWithSecret(encryptedData: string, secret: string): string {
  const parts = encryptedData.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted data format");
  }

  const [ivHex, authTagHex, encryptedTextHex] = parts;
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");
  const key = getKey(secret);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedTextHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
