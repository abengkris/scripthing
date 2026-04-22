import { register, login, refresh } from '../services/auth.service';
import { describe, it, expect } from 'vitest';

describe('AuthService', () => {
  it('should register a new user', async () => {
    const result = await register({ email: 'new@example.com', password: 'password123', name: 'New' });
    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe('new@example.com');
  });

  it('should reject registration if email exists', async () => {
    await expect(register({ email: 'exist@example.com', password: 'password123', name: 'New' })).rejects.toThrow('Email already in use');
  });

  it('should login an existing user with correct password', async () => {
    const result = await login({ email: 'exist@example.com', password: 'password123' });
    expect(result.accessToken).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    await expect(login({ email: 'exist@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
  });

  it('should refresh tokens with a valid refresh token', async () => {
    const loginResult = await login({ email: 'exist@example.com', password: 'password123' });
    const refreshResult = await refresh(loginResult.refreshToken);
    expect(refreshResult.accessToken).toBeDefined();
    expect(refreshResult.user.id).toBe('user-id');
  });

  it('should reject refresh with an invalid token', async () => {
    await expect(refresh('invalid-token')).rejects.toThrow('Invalid refresh token');
  });
});
