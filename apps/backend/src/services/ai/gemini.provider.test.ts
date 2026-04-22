import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GeminiProvider } from './gemini.provider';

const mockGenerateContent = vi.fn().mockImplementation(async (prompt) => {
  // prompt is a string here due to transformMessages
  if (typeof prompt === 'string' && prompt.includes('FAIL')) {
    throw new Error('Gemini Error');
  }
  return {
    response: {
      text: () => 'Hello world',
      usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 5, totalTokenCount: 15 },
    }
  };
});

const mockGenerateContentStream = vi.fn().mockImplementation(async (prompt) => {
  return {
    stream: (async function* () {
      yield { text: () => 'Hello' };
      yield { text: () => ' world' };
    })(),
  };
});

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel = vi.fn().mockReturnValue({
        generateContent: mockGenerateContent,
        generateContentStream: mockGenerateContentStream,
      });
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

  it('should complete successfully', async () => {
    const result = await provider.complete({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'gemini-1.5-pro',
    });

    expect(result.content).toBe('Hello world');
    expect(result.provider).toBe('gemini');
  });

  it('should handle API errors', async () => {
    await expect(provider.complete({
      messages: [{ role: 'user', content: 'FAIL' }],
      model: 'gemini-1.5-pro',
    })).rejects.toThrow('Gemini Error');
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
});
