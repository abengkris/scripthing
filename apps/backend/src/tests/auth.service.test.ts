import { register, login } from '../services/auth.service';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.email === 'exist@example.com') {
          return { id: 'user-id', email: 'exist@example.com', name: 'Existing User', passwordHash: 'hashed' };
        }
        return null;
      }),
      create: vi.fn().mockImplementation(async ({ data }) => {
        return { id: 'new-id', email: data.email, name: data.name, passwordHash: data.passwordHash };
      }),
    },
  };
  return {
    PrismaClient: class {
      user = mockPrismaClient.user;
    }
  };
});

vi.mock('bcryptjs', () => ({
  default: {
    hash: vi.fn().mockResolvedValue('hashed'),
    compare: vi.fn().mockImplementation(async (pass, hash) => pass === 'correct' && hash === 'hashed'),
  }
}));

describe('AuthService', () => {
  it('should register a new user', async () => {
    const result = await register({ email: 'new@example.com', password: 'pass', name: 'New' });
    expect(result.accessToken).toBeDefined();
    expect(result.user.email).toBe('new@example.com');
  });

  it('should login an existing user with correct password', async () => {
    const result = await login({ email: 'exist@example.com', password: 'correct' });
    expect(result.accessToken).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    await expect(login({ email: 'exist@example.com', password: 'wrong' })).rejects.toThrow('Invalid credentials');
  });
});
