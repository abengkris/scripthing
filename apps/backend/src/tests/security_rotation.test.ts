import { describe, it, expect } from "vitest";
import { encrypt, decrypt } from "../lib/security";
import { config } from "../config";

describe("Graceful Key Rotation", () => {
  it("should decrypt with current secret", () => {
    const originalText = "secret-data";
    const encrypted = encrypt(originalText);
    const result = decrypt(encrypted);
    expect(result.text).toBe(originalText);
    expect(result.needsMigration).toBe(false);
  });

  it("should decrypt with previous secret and signal migration", () => {
    const originalText = "secret-data";

    // Encrypt with PREVIOUS secret (simulate old data)
    config.APP_SECRET_PREVIOUS = "old-secret-1234567890123456789012345678";

    const tempSecret = config.APP_SECRET;
    (config as any).APP_SECRET = config.APP_SECRET_PREVIOUS;
    const encrypted = encrypt(originalText);
    (config as any).APP_SECRET = tempSecret;

    const result = decrypt(encrypted);
    expect(result.text).toBe(originalText);
    expect(result.needsMigration).toBe(true);
  });
});
