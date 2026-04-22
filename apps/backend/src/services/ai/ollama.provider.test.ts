import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OllamaProvider } from './ollama.provider';

vi.mock('node-fetch', () => ({
  default: vi.fn().mockImplementation(async (url, options) => {
    // If it's the testConnection call (/api/tags)
    if (url.endsWith('/api/tags')) {
      return { ok: true };
    }

    const body = JSON.parse(options.body);
    if (body.messages?.[0]?.content === 'FAIL') {
      return {
        ok: false,
        statusText: 'Ollama Internal Error',
        json: async () => ({ error: 'Ollama Internal Error' }),
      };
    }
    if (body.stream === false) {
      return {
        ok: true,
        json: async () => ({
          message: { content: 'Hello world' },
          model: body.model,
        }),
      };
    }
    return {
      ok: true,
      body: (async function* () {
        yield Buffer.from(JSON.stringify({ message: { content: 'Hello' } }) + '\n');
        yield Buffer.from(JSON.stringify({ message: { content: ' world' } }) + '\n');
        yield Buffer.from(JSON.stringify({ done: true }) + '\n');
      })(),
    };
  }),
}));

describe('OllamaProvider', () => {
  let provider: OllamaProvider;
  const baseUrl = 'http://localhost:11434';

  beforeEach(() => {
    provider = new OllamaProvider(baseUrl);
    vi.clearAllMocks();
  });

  it('should have the correct name', () => {
    expect(provider.name).toBe('ollama');
  });

  it('should complete successfully', async () => {
    const result = await provider.complete({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'llama3',
    });

    expect(result.content).toBe('Hello world');
    expect(result.provider).toBe('ollama');
  });

  it('should handle API errors', async () => {
    await expect(provider.complete({
      messages: [{ role: 'user', content: 'FAIL' }],
      model: 'llama3',
    })).rejects.toThrow('Ollama error: Ollama Internal Error');
  });

  it('should stream successfully', async () => {
    const stream = provider.completeStream({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'llama3',
    });

    const chunks: string[] = [];
    for await (const chunk of stream) {
      if (chunk.content) chunks.push(chunk.content);
    }

    expect(chunks.join('')).toBe('Hello world');
  });
});
