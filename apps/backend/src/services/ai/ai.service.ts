import { BaseAIProvider } from './base.provider';
import { OpenAIProvider } from './openai.provider';
import { AnthropicProvider } from './anthropic.provider';
import { GeminiProvider } from './gemini.provider';
import { OllamaProvider } from './ollama.provider';
import { getSettings } from '../settings.service';
import { AICompletionOptions, AICompletionResult, SUPPORTED_MODELS } from './types';
import { AppError } from '../../middleware/error.middleware';

export async function getProvider(prisma: any, userId: string, providerName: string): Promise<BaseAIProvider> {
  const settings = await getSettings(prisma, userId, { decryptKeys: true });

  switch (providerName) {
    case 'openai':
      if (!settings.openaiApiKey) throw new AppError(400, 'OpenAI API Key not configured');
      return new OpenAIProvider(settings.openaiApiKey);
    case 'anthropic':
      if (!settings.anthropicApiKey) throw new AppError(400, 'Anthropic API Key not configured');
      return new AnthropicProvider(settings.anthropicApiKey);
    case 'gemini':
      if (!settings.geminiApiKey) throw new AppError(400, 'Gemini API Key not configured');
      return new GeminiProvider(settings.geminiApiKey);
    case 'ollama':
      return new OllamaProvider(settings.ollamaEndpoint || 'http://localhost:11434');
    default:
      throw new AppError(400, `Unknown provider: "${providerName}"`);
  }
}

export async function complete(
  prisma: any,
  userId: string,
  providerName: string,
  options: AICompletionOptions
): Promise<AICompletionResult> {
  const provider = await getProvider(prisma, userId, providerName);
  return provider.complete(options);
}

export async function* completeStream(
  prisma: any,
  userId: string,
  providerName: string,
  options: AICompletionOptions
): AsyncIterable<Partial<AICompletionResult>> {
  const provider = await getProvider(prisma, userId, providerName);
  yield* provider.completeStream(options);
}

export async function testProvider(
  prisma: any,
  userId: string,
  providerName: string
): Promise<boolean> {
  const provider = await getProvider(prisma, userId, providerName);
  return provider.testConnection();
}

export function getModels() {
  return SUPPORTED_MODELS;
}
