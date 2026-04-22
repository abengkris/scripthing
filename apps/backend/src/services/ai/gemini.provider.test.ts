import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiProvider } from './gemini.provider';

vi.mock('@google/generative-ai', () => {
  const mockResponse = {
    text: () => 'Hello world',
    usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, totalTokenCount: 15 },
  };

  const mockStream = (async function* () {
    yield { text: () => 'Hello' };
    yield { text: () => ' world' };
  })();

  const mockModel = {
    generateContent: vi.fn().mockResolvedValue({ response: mockResponse }),
    generateContentStream: vi.fn().mockResolvedValue({ stream: mockStream }),
  };

  return {
    GoogleGenerativeAI: class {
      getGenerativeModel = vi.fn().mockReturnValue(mockModel);
    }
  };
});

describe('GeminiProvider', () => {
  let provider: GeminiProvider;
  const apiKey = 'test-api-key';

  beforeEach(() => {
    provider = new GeminiProvider(apiKey);
    vi.clearAllMocks();
  });

  it('should have the correct name', () => {
    expect(provider.name).toBe('gemini');
  });

  it('should support specific models', () => {
    expect(provider.supportedModels).toContain('gemini-1.5-pro');
  });

  it('should complete successfully', async () => {
    const result = await provider.complete({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'gemini-1.5-pro',
    });

    expect(result.content).toBe('Hello world');
    expect(result.provider).toBe('gemini');
    expect(result.usage?.totalTokens).toBe(15);
  });

  it('should stream successfully', async () => {
    const stream = provider.completeStream({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'gemini-1.5-pro',
    });

    const chunks: string[] = [];
    for await (const chunk of stream) {
      if (chunk.content) chunks.push(chunk.content);
    }

    expect(chunks.join('')).toBe('Hello world');
  });

  it('should test connection successfully', async () => {
    const isConnected = await provider.testConnection();
    expect(isConnected).toBe(true);
  });
});
