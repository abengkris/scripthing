import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OllamaProvider } from './ollama.provider';
import fetch from 'node-fetch';

vi.mock('node-fetch');

describe('OllamaProvider', () => {
  let provider: OllamaProvider;
  const endpoint = 'http://localhost:11434';

  beforeEach(() => {
    provider = new OllamaProvider(endpoint);
    vi.clearAllMocks();
  });

  it('should have the correct name', () => {
    expect(provider.name).toBe('ollama');
  });

  it('should support specific models', () => {
    expect(provider.supportedModels).toContain('llama3');
  });

  it('should complete successfully', async () => {
    (fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({
        message: { content: 'Hello world' },
        model: 'llama3',
      }),
    });

    const result = await provider.complete({
      messages: [{ role: 'user', content: 'Hi' }],
      model: 'llama3',
    });

    expect(result.content).toBe('Hello world');
    expect(result.provider).toBe('ollama');
  });

  it('should stream successfully', async () => {
    const mockStream = (async function* () {
      yield Buffer.from(JSON.stringify({ message: { content: 'Hello' }, done: false }) + '\n');
      yield Buffer.from(JSON.stringify({ message: { content: ' world' }, done: false }) + '\n');
      yield Buffer.from(JSON.stringify({ done: true }) + '\n');
    })();

    (fetch as any).mockResolvedValue({
      ok: true,
      body: mockStream,
    });

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

  it('should test connection successfully', async () => {
    (fetch as any).mockResolvedValue({ ok: true });
    const isConnected = await provider.testConnection();
    expect(isConnected).toBe(true);
  });
});
