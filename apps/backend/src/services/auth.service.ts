import { RegisterRequest, LoginRequest, AuthResponse } from '@shared/types/api.types';
import bcrypt from 'bcrypt';
import { SignJWT, jwtVerify } from 'jose';
import { config } from '../config';
import { prisma } from '../plugins/prisma';
import { AppError } from '../middleware/error.middleware';

const SALT_ROUNDS = 12;
const APP_SECRET = new TextEncoder().encode(config.APP_SECRET);

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new AppError(409, 'Email already in use');

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { ...data, passwordHash }
    });

    const token = await new SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(config.JWT_EXPIRES_IN)
      .sign(APP_SECRET);

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.passwordHash))) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = await new SignJWT({ sub: user.id, email: user.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(config.JWT_EXPIRES_IN)
      .sign(APP_SECRET);

    return { token, user: { id: user.id, name: user.name, email: user.email } };
  }
};
