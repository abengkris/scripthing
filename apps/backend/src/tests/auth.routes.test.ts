import { describe, it, expect, beforeAll, vi } from 'vitest';
import fastify from 'fastify';
import authRoutes from '../routes/auth';

// Mock prisma and bcrypt for route testing
vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.email === 'exist@example.com' || where.id === 'user-id') {
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
    compare: vi.fn().mockResolvedValue(true),
  }
}));

describe('Auth Routes', () => {
  let app: any;

  beforeAll(async () => {
    app = fastify();
    // Assuming auth plugin is just standard routes for now
    await app.register(authRoutes, { prefix: '/api/v1/auth' });
  });

  it('should register a new user successfully', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/register',
      payload: { email: 'new@example.com', password: 'password123', name: 'New User' },
    });
    
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('accessToken');
    expect(body.data).toHaveProperty('refreshToken');
    expect(body.data.user).toHaveProperty('email', 'new@example.com');
  });

  it('should login an existing user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'exist@example.com', password: 'password123' },
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('accessToken');
    expect(body.data).toHaveProperty('refreshToken');
    expect(body.data.user).toHaveProperty('email', 'exist@example.com');
  });

  it('should refresh a token', async () => {
    // First login to get a refresh token
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/login',
      payload: { email: 'exist@example.com', password: 'password123' },
    });
    const loginBody = JSON.parse(loginRes.payload);
    const refreshToken = loginBody.data.refreshToken;

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/refresh',
      payload: { refreshToken },
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('accessToken');
    expect(body.data).toHaveProperty('refreshToken');
  });

  it('should logout a user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/auth/logout',
    });
    
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.payload);
    expect(body.success).toBe(true);
    expect(body.message).toBe('Logged out');
  });
});
