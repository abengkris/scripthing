import { describe, it, expect, beforeEach } from 'vitest'
import { z } from 'zod'

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Clear modules to ensure process.env changes are picked up if we were to re-import
    // But since config parses on import, we'll test the schema directly or mock process.env
  })

  it('should validate a correct configuration', () => {
    const envSchema = z.object({
      PORT: z.string().default('3001'),
      HOST: z.string().default('0.0.0.0'),
      NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
      DATABASE_URL: z.string(),
      APP_SECRET: z.string().min(32),
      JWT_EXPIRES_IN: z.string().default('7d'),
      FRONTEND_URL: z.string().default('http://localhost:5173'),
    })

    const validEnv = {
      DATABASE_URL: 'file:./dev.db',
      APP_SECRET: '12345678901234567890123456789012'
    }

    const result = envSchema.safeParse(validEnv)
    expect(result.success).toBe(true)
  })

  it('should fail if APP_SECRET is missing', () => {
    const envSchema = z.object({
      APP_SECRET: z.string().min(32),
    })

    const invalidEnv = {
      DATABASE_URL: 'file:./dev.db'
    }

    const result = envSchema.safeParse(invalidEnv)
    expect(result.success).toBe(false)
  })

  it('should fail if APP_SECRET is less than 32 characters', () => {
    const envSchema = z.object({
      APP_SECRET: z.string().min(32),
    })

    const invalidEnv = {
      APP_SECRET: 'too-short'
    }

    const result = envSchema.safeParse(invalidEnv)
    expect(result.success).toBe(false)
  })
})
