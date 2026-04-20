import { GeminiProvider } from './gemini.provider';
import { describe, it, expect, vi } from 'vitest';

describe('GeminiProvider', () => {
  it('should analyze screenplay plot', async () => {
    const provider = new GeminiProvider('fake-api-key');
    vi.spyOn(provider as any, 'complete').mockResolvedValue({ content: 'Mock Analysis' });
    const result = await provider.complete({
      messages: [{ role: 'user', content: 'Analyze this screenplay: INT. OFFICE - DAY. JOHN sits.' }],
      model: 'gemini-2.0-flash'
    });
    expect(result.content).toBe('Mock Analysis');
  });
});
