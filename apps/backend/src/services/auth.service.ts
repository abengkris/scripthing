import { RegisterRequest, LoginRequest } from '@packages/shared/types/api.types';
import { prisma } from '../db';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { config } from '../config';
import { AppError } from '../middleware/error.middleware';

const APP_SECRET = new TextEncoder().encode(config.APP_SECRET);

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string | null;
  };
}

async function createTokens(user: { id: string; email: string; name: string | null }): Promise<AuthTokens> {
  const accessToken = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(APP_SECRET);

  const refreshToken = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(APP_SECRET);

  return {
    accessToken,
    refreshToken,
    user,
  };
}

export async function register(data: RegisterRequest): Promise<AuthTokens> {
  const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
  if (existingUser) {
    throw new AppError(409, 'Email already in use');
  }

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      passwordHash,
    },
  });

  return createTokens({ id: user.id, email: user.email, name: user.name });
}

export async function login(data: LoginRequest): Promise<AuthTokens> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    throw new AppError(401, 'Invalid credentials');
  }

  return createTokens({ id: user.id, email: user.email, name: user.name });
}

export async function refresh(token: string): Promise<AuthTokens> {
  try {
    const { payload } = await jwtVerify(token, APP_SECRET);
    const userId = payload.sub as string;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user) {
      throw new AppError(401, 'User not found');
    }

    return createTokens({ id: user.id, email: user.email, name: user.name });
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }
}

export async function logout(): Promise<void> {
  // In a stateless JWT implementation, logout is generally handled client-side.
  // Unless we want to keep a denylist of tokens in the DB, this is a no-op.
}

export async function verifyToken(token: string): Promise<{ userId: string }> {
  try {
    const { payload } = await jwtVerify(token, APP_SECRET);
    return { userId: payload.sub as string };
  } catch {
    throw new AppError(401, 'Unauthorized');
  }
}
