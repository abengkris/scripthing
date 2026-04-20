import { AuthService } from '../services/auth.service';
import { describe, it, expect } from 'vitest';

describe('AuthService', () => {
  const authService = new AuthService();

  it('should hash and verify passwords', async () => {
    const password = 'mySecurePassword';
    const hash = await authService.hashPassword(password);
    expect(hash).not.toBe(password);
    
    const isValid = await authService.verifyPassword(password, hash);
    expect(isValid).toBe(true);

    const isInvalid = await authService.verifyPassword('wrongPassword', hash);
    expect(isInvalid).toBe(false);
  });
});
