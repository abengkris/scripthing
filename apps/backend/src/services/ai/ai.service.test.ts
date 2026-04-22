import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as aiService from './ai.service';
import * as settingsService from '../settings.service';
import { OpenAIProvider } from './openai.provider';
import { AnthropicProvider } from './anthropic.provider';
import { GeminiProvider } from './gemini.provider';
import { OllamaProvider } from './ollama.provider';

vi.mock('../settings.service');
vi.mock('./openai.provider');
vi.mock('./anthropic.provider');
vi.mock('./gemini.provider');
vi.mock('./ollama.provider');

describe('AIService', () => {
  let mockPrisma: any;
  const userId = 'user-123';

  beforeEach(() => {
    mockPrisma = {};
    vi.clearAllMocks();
  });

  it('should return OpenAIProvider when configured', async () => {
    (settingsService.getSettings as any).mockResolvedValue({
      openaiApiKey: 'sk-test',
    });

    const provider = await aiService.getProvider(mockPrisma, userId, 'openai');
    expect(provider).toBeInstanceOf(OpenAIProvider);
    expect(OpenAIProvider).toHaveBeenCalledWith('sk-test');
  });

  it('should throw error if OpenAI key is missing', async () => {
    (settingsService.getSettings as any).mockResolvedValue({
      openaiApiKey: null,
    });

    await expect(aiService.getProvider(mockPrisma, userId, 'openai')).rejects.toThrow('OpenAI API Key not configured');
  });

  it('should return OllamaProvider with custom endpoint', async () => {
    (settingsService.getSettings as any).mockResolvedValue({
      ollamaEndpoint: 'http://my-ollama:11434',
    });

    const provider = await aiService.getProvider(mockPrisma, userId, 'ollama');
    expect(provider).toBeInstanceOf(OllamaProvider);
    expect(OllamaProvider).toHaveBeenCalledWith('http://my-ollama:11434');
  });

  it('should complete using the correct provider', async () => {
    (settingsService.getSettings as any).mockResolvedValue({
      geminiApiKey: 'gem-test',
    });
    
    const mockResult = { content: 'hello' };
    (GeminiProvider.prototype.complete as any).mockResolvedValue(mockResult);

    const result = await aiService.complete(mockPrisma, userId, 'gemini', {
      messages: [],
      model: 'gemini-1.5-flash',
    });

    expect(result).toBe(mockResult);
  });
});
