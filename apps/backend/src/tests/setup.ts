import { vi } from 'vitest';

vi.mock('puppeteer', () => ({
  default: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        setContent: vi.fn().mockResolvedValue(undefined),
        pdf: vi.fn().mockResolvedValue(Buffer.from('mock pdf content')),
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock('@prisma/client', () => {
  const mockPrismaClient = {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    script: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    snapshot: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    settings: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    $disconnect: vi.fn(),
  };

  return {
    PrismaClient: class {
      user = mockPrismaClient.user;
      project = mockPrismaClient.project;
      script = mockPrismaClient.script;
      snapshot = mockPrismaClient.snapshot;
      settings = mockPrismaClient.settings;
      $disconnect = mockPrismaClient.$disconnect;
    }
  };
});
