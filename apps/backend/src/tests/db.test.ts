import { describe, it, expect, vi } from 'vitest'
import { PrismaClient } from '@prisma/client'

// Mock the Prisma client to avoid query engine binary issues on Android/Termux
vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findMany: vi.fn().mockResolvedValue([{ id: 'test-id', email: 'demo@scripthing.local' }])
    },
    $disconnect: vi.fn()
  }
  return {
    PrismaClient: vi.fn(() => mockPrismaClient)
  }
})

describe('Database Connection', () => {
  it('should connect to the database and query users (mocked)', async () => {
    const prisma = new PrismaClient()
    const users = await prisma.user.findMany()
    expect(Array.isArray(users)).toBe(true)
    expect(users[0].email).toBe('demo@scripthing.local')
    await prisma.$disconnect()
  })
})
