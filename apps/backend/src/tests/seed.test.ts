import { describe, it, expect, vi } from 'vitest'
import { seedDatabase } from '../seed'

// Mock the Prisma client
vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      upsert: vi.fn().mockResolvedValue({ id: 'demo-id', email: 'demo@scripthing.local' })
    },
    $disconnect: vi.fn()
  }
  return {
    PrismaClient: class {
      user = mockPrismaClient.user;
      $disconnect = mockPrismaClient.$disconnect;
    }
  }
})

describe('Database Seed', () => {
  it('should upsert the demo user', async () => {
    const result = await seedDatabase()
    expect(result.email).toBe('demo@scripthing.local')
  })
})
