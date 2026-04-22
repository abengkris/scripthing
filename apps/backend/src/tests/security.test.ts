import { describe, it, expect, vi, beforeEach } from 'vitest';
import { encrypt, decrypt } from '../lib/security';

// Mock config because it validates env on import
vi.mock('../config', () => ({
  config: {
    APP_SECRET: 'test-secret-at-least-32-chars-long-12345'
  }
}));

describe('Security Utility', () => {
  const plaintext = 'sk-1234567890abcdefghijklmnopqrstuvwxyz';

  it('should encrypt and decrypt correctly', () => {
    const encrypted = encrypt(plaintext);
    expect(encrypted).not.toBe(plaintext);
    expect(typeof encrypted).toBe('string');
    expect(encrypted.split(':')).toHaveLength(3); // iv:authTag:encrypted

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(plaintext);
  });

  it('should produce different ciphertexts for the same plaintext (IV randomness)', () => {
    const encrypted1 = encrypt(plaintext);
    const encrypted2 = encrypt(plaintext);
    expect(encrypted1).not.toBe(encrypted2);
  });

  it('should throw error if decryption fails (e.g. malformed data)', () => {
    expect(() => decrypt('malformed:data:here')).toThrow();
  });

  it('should throw error if auth tag is tampered with', () => {
    const encrypted = encrypt(plaintext);
    const [iv, authTag, content] = encrypted.split(':');
    const tamperedTag = authTag.substring(0, authTag.length - 2) + '00';
    const tampered = `${iv}:${tamperedTag}:${content}`;
    
    expect(() => decrypt(tampered)).toThrow();
  });
});
