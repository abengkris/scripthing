import { describe, it, expect, vi, beforeEach } from "vitest";
import * as settingsService from "../services/settings.service";
import { encrypt, decrypt } from "../lib/security";

vi.mock("../lib/security", () => ({
  encrypt: vi.fn((val) => `enc:${val}`),
  decrypt: vi.fn((val) => ({
    text: val.replace("enc:", ""),
    needsMigration: false,
  })),
}));

describe("SettingsService", () => {
  let mockPrisma: any;

  beforeEach(() => {
    mockPrisma = {
      settings: {
        upsert: vi.fn(),
        findUnique: vi.fn(),
      },
    };
    vi.clearAllMocks();
  });

  const userId = "user-123";
  const rawApiKey = "sk-proper-api-key-value";

  it("should encrypt API keys before saving", async () => {
    mockPrisma.settings.upsert.mockResolvedValue({
      userId,
      openaiApiKey: `enc:${rawApiKey}`,
    });

    await settingsService.updateSettings(mockPrisma, userId, {
      openaiApiKey: rawApiKey,
    });

    expect(encrypt).toHaveBeenCalledWith(rawApiKey);
    expect(mockPrisma.settings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          openaiApiKey: `enc:${rawApiKey}`,
        }),
      }),
    );
  });

  it("should decrypt API keys when retrieving (internal use)", async () => {
    mockPrisma.settings.findUnique.mockResolvedValue({
      userId,
      openaiApiKey: `enc:${rawApiKey}`,
    });

    const settings = await settingsService.getSettings(mockPrisma, userId, {
      decryptKeys: true,
    });

    expect(decrypt).toHaveBeenCalledWith(`enc:${rawApiKey}`);
    expect(settings.openaiApiKey).toBe(rawApiKey);
  });

  it("should return masked API keys for public use", async () => {
    mockPrisma.settings.findUnique.mockResolvedValue({
      userId,
      openaiApiKey: `enc:${rawApiKey}`,
      anthropicApiKey: null,
    });

    const settings = await settingsService.getSettings(mockPrisma, userId, {
      decryptKeys: false,
    });

    expect(decrypt).toHaveBeenCalledWith(`enc:${rawApiKey}`); // Used inside maskKey
    // Assuming rawApiKey is 'sk-proper-api-key-value', last 4 is 'alue'
    expect(settings.openaiApiKey).toBe("****alue");
    expect(settings.anthropicApiKey).toBeNull();
  });
});
