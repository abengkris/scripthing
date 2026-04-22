import { encrypt, decrypt } from '../lib/security';

const API_KEY_FIELDS = ['openaiApiKey', 'anthropicApiKey', 'geminiApiKey'] as const;

export interface GetSettingsOptions {
  decryptKeys?: boolean;
}

/**
 * Mask an API key to show only the last 4 characters.
 */
function maskKey(key: string | null): string | null {
  if (!key) return null;
  const decrypted = decrypt(key);
  if (decrypted.length <= 4) return '****';
  return `****${decrypted.slice(-4)}`;
}

export async function getSettings(prisma: any, userId: string, options: GetSettingsOptions = {}) {
  const settings = await prisma.settings.findUnique({
    where: { userId },
  });

  if (!settings) {
    return {
      userId,
      openaiApiKey: null,
      anthropicApiKey: null,
      geminiApiKey: null,
      ollamaEndpoint: 'http://localhost:11434',
      activeProvider: null,
      activeModel: null,
      aiTemperature: 0.7,
      theme: 'dark',
      fontSize: 12,
      fontFamily: 'Courier Prime',
      autoSaveInterval: 30,
    };
  }

  const result = { ...settings };

  for (const field of API_KEY_FIELDS) {
    if (result[field]) {
      if (options.decryptKeys) {
        result[field] = decrypt(result[field]);
      } else {
        result[field] = maskKey(result[field]);
      }
    }
  }

  return result;
}

export async function updateSettings(prisma: any, userId: string, data: any) {
  const updateData = { ...data };

  // Encrypt sensitive fields
  for (const field of API_KEY_FIELDS) {
    if (updateData[field] !== undefined && updateData[field] !== null) {
      // If it's already masked (e.g. sent back from frontend), don't update it
      if (typeof updateData[field] === 'string' && updateData[field].startsWith('****')) {
        delete updateData[field];
      } else {
        updateData[field] = encrypt(updateData[field]);
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
