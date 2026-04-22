import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAIProvider } from './openai.provider';

const mockCreate = vi.fn().mockImplementation(async (options) => {
  if (options.messages?.[0]?.content === 'FAIL') {
    throw new Error('API Error');
  }
  if (options.stream) {
    return (async function* () {
      yield { choices: [{ delta: { content: 'Hello' } }] };
      yield { choices: [{ delta: { content: ' world' } }] };
    })();
  }
  return {
    choices: [{ message: { content: 'Hello world' } }],
    model: options.model,
    usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 },
  };
});

vi.mock('openai', () => {
  return {
    default: class {
      chat = {
        completions: {
          create: mockCreate
        }
      };
      models = {
        list: vi.fn().mockResolvedValue({ data: [] })
      };
    }
  };
});

describe('OpenAIProvider', () => {
  let provider: OpenAIProvider;
  const apiKey = 'test-api-key';

  beforeEach(() => {
    provider = new OpenAIProvider(apiKey);
    vi.clearAllMocks();
  });

  it('should have the correct name', () => {
    expect(provider.name).toBe('openai');
  });

  it('should support specific models', () => {
    expect(provider.supportedModels).toContain('gpt-4o');
    expect(provider.supportedModels).toContain('gpt-4o-mini');
  });

  it('should complete successfully', async () => {
    const result = await provider.complete({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'gpt-4o',
    });

    expect(result.content).toBe('Hello world');
    expect(result.provider).toBe('openai');
    expect(result.usage?.totalTokens).toBe(15);
  });

  it('should handle API errors gracefully', async () => {
    await expect(provider.complete({
      messages: [{ role: 'user', content: 'FAIL' }],
      model: 'gpt-4o',
    })).rejects.toThrow('API Error');
  });

  it('should stream successfully', async () => {
    const stream = provider.completeStream({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'gpt-4o',
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
