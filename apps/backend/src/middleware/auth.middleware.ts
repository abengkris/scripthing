import { FastifyReply, FastifyRequest } from 'fastify';
import { jwtVerify } from 'jose';
import { config } from '../config';
import { AppError } from './error.middleware';

const APP_SECRET = new TextEncoder().encode(config.APP_SECRET);

declare module 'fastify' {
  interface FastifyRequest {
    userId: string;
  }
}

export const authMiddleware = async (req: FastifyRequest, _reply: FastifyReply) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError(401, 'Unauthorized');
  }

  const token = authHeader.split(' ')[1];
  try {
    const { payload } = await jwtVerify(token, APP_SECRET);
    req.userId = payload.sub as string;
  } catch {
    throw new AppError(401, 'Unauthorized');
  }
};
