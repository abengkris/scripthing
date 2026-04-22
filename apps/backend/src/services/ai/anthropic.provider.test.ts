import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnthropicProvider } from './anthropic.provider';

vi.mock('@anthropic-ai/sdk', () => {
  const mockCreate = vi.fn().mockImplementation(async (options) => {
    if (options.stream) {
      return (async function* () {
        yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello' } };
        yield { type: 'content_block_delta', delta: { type: 'text_delta', text: ' world' } };
        yield { type: 'message_stop' };
      })();
    }
    return {
      content: [{ type: 'text', text: 'Hello world' }],
      model: options.model,
      usage: { input_tokens: 10, output_tokens: 5 },
    };
  });

  return {
    default: class {
      messages = {
        create: mockCreate
      };
    }
  };
});

describe('AnthropicProvider', () => {
  let provider: AnthropicProvider;
  const apiKey = 'test-api-key';

  beforeEach(() => {
    provider = new AnthropicProvider(apiKey);
    vi.clearAllMocks();
  });

  it('should have the correct name', () => {
    expect(provider.name).toBe('anthropic');
  });

  it('should support specific models', () => {
    expect(provider.supportedModels).toContain('claude-3-5-sonnet-20240620');
  });

  it('should complete successfully', async () => {
    const result = await provider.complete({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'claude-3-5-sonnet-20240620',
    });

    expect(result.content).toBe('Hello world');
    expect(result.provider).toBe('anthropic');
    expect(result.usage?.totalTokens).toBe(15);
  });

  it('should stream successfully', async () => {
    const stream = provider.completeStream({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'claude-3-5-sonnet-20240620',
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
