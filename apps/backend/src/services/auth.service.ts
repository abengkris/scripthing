import { RegisterRequest, LoginRequest, AuthResponse } from '@packages/shared/types/api.types';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { config } from '../config';
import { AppError } from '../middleware/error.middleware';

const prisma = new PrismaClient();
const APP_SECRET = new TextEncoder().encode(config.APP_SECRET);

export async function register(data: RegisterRequest): Promise<AuthResponse> {
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

  const token = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(config.JWT_EXPIRES_IN)
    .sign(APP_SECRET);

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
    throw new AppError(401, 'Invalid credentials');
  }

  const token = await new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime(config.JWT_EXPIRES_IN)
    .sign(APP_SECRET);

  return {
    token,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

export async function verifyToken(token: string): Promise<{ userId: string }> {
  try {
    const { payload } = await jwtVerify(token, APP_SECRET);
    return { userId: payload.sub as string };
  } catch {
    throw new AppError(401, 'Unauthorized');
  }
}
