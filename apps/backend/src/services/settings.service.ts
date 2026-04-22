import { encrypt, decrypt } from "../lib/security";

const API_KEY_FIELDS = [
  "openaiApiKey",
  "anthropicApiKey",
  "geminiApiKey",
] as const;

export interface GetSettingsOptions {
  decryptKeys?: boolean;
}

/**
 * Mask an API key to show only the last 4 characters.
 */
function maskKey(key: string | null): string | null {
  if (!key) return null;
  const { text } = decrypt(key);
  if (text.length <= 4) return "****";
  return `****${text.slice(-4)}`;
}

export async function getSettings(
  prisma: {
    settings: {
      findUnique: (args: {
        where: { userId: string };
      }) => Promise<Record<string, unknown> | null>;
    };
  },
  userId: string,
  options: GetSettingsOptions = {},
) {
  const settings = await prisma.settings.findUnique({
    where: { userId },
  });

  if (!settings) {
    return {
      userId,
      openaiApiKey: null,
      anthropicApiKey: null,
      geminiApiKey: null,
      ollamaEndpoint: "http://localhost:11434",
      activeProvider: null,
      activeModel: null,
      aiTemperature: 0.7,
      theme: "dark",
      fontSize: 12,
      fontFamily: "Courier Prime",
      autoSaveInterval: 30,
    };
  }

  const result = { ...settings };

  for (const field of API_KEY_FIELDS) {
    if (result[field]) {
      if (options.decryptKeys) {
        const { text } = decrypt(result[field]);
        result[field] = text;
      } else {
        result[field] = maskKey(result[field]);
      }
    }
  }

  return result;
}

export async function updateSettings(
  prisma: {
    settings: {
      upsert: (args: {
        where: { userId: string };
        update: Record<string, unknown>;
        create: Record<string, unknown>;
      }) => Promise<Record<string, unknown>>;
    };
  },
  userId: string,
  data: Record<string, unknown>,
) {
  const updateData = { ...data } as Record<string, unknown>;

  // Encrypt sensitive fields
  for (const field of API_KEY_FIELDS) {
    if (updateData[field] !== undefined && updateData[field] !== null) {
      // If it's already masked (e.g. sent back from frontend), don't update it
      const value = updateData[field];
      if (typeof value === "string" && value.startsWith("****")) {
        delete updateData[field];
      } else {
        updateData[field] = encrypt(String(value));
      }
    }
  }

  return prisma.settings.upsert({
    where: { userId },
    update: updateData,
    create: {
      userId,
      ...updateData,
    },
  });
}
