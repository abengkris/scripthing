import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnthropicProvider } from './anthropic.provider';

const mockCreate = vi.fn().mockImplementation(async (options) => {
  if (options.messages?.[0]?.content === 'FAIL') {
    throw new Error('Anthropic Error');
  }
  if (options.stream) {
    return (async function* () {
      yield { type: 'content_block_delta', delta: { type: 'text_delta', text: 'Hello' } };
      yield { type: 'content_block_delta', delta: { type: 'text_delta', text: ' world' } };
    })();
  }
  return {
    content: [{ type: 'text', text: 'Hello world' }],
    model: options.model,
    usage: { input_tokens: 10, output_tokens: 5 },
  };
});

vi.mock('@anthropic-ai/sdk', () => {
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

  it('should complete successfully', async () => {
    const result = await provider.complete({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'claude-3-5-sonnet-20240620',
    });

    expect(result.content).toBe('Hello world');
    expect(result.provider).toBe('anthropic');
  });

  it('should handle API errors', async () => {
    await expect(provider.complete({
      messages: [{ role: 'user', content: 'FAIL' }],
      model: 'claude-3-5-sonnet-20240620',
    })).rejects.toThrow('Anthropic Error');
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
});
