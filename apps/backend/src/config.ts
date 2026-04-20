import { z } from 'zod';

const envSchema = z.object({
  PORT:           z.string().default('3001'),
  HOST:           z.string().default('0.0.0.0'),
  NODE_ENV:       z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL:   z.string(),
  APP_SECRET:     z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL:   z.string().default('http://localhost:5173'),
  SALT_ROUNDS:    z.string().optional(),
});

export const config = envSchema.parse(process.env);
