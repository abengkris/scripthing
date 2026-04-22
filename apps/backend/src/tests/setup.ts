import { vi } from "vitest";
import { Buffer } from "node:buffer";

vi.mock("puppeteer", () => ({
  default: {
    launch: vi.fn().mockResolvedValue({
      newPage: vi.fn().mockResolvedValue({
        setContent: vi.fn().mockResolvedValue(undefined),
        pdf: vi.fn().mockResolvedValue(Buffer.from("mock pdf content")),
      }),
      close: vi.fn().mockResolvedValue(undefined),
    }),
  },
}));

vi.mock("bcrypt", () => ({
  default: {
    hash: vi.fn().mockResolvedValue("hashed"),
    compare: vi
      .fn()
      .mockImplementation(
        async (pass, hash) => pass === "password123" && hash === "hashed",
      ),
  },
  hash: vi.fn().mockResolvedValue("hashed"),
  compare: vi
    .fn()
    .mockImplementation(
      async (pass, hash) => pass === "password123" && hash === "hashed",
    ),
}));

vi.mock("bcryptjs", () => {
  const mockBcrypt = {
    hash: vi.fn().mockResolvedValue("hashed"),
    compare: vi
      .fn()
      .mockImplementation(
        async (pass, hash) => pass === "password123" && hash === "hashed",
      ),
  };
  return {
    ...mockBcrypt,
    default: mockBcrypt,
  };
});

vi.mock("@prisma/client", () => {
  const mockPrismaClient = {
    user: {
      findUnique: vi.fn().mockImplementation(async ({ where }) => {
        if (where.email === "exist@example.com" || where.id === "user-id") {
          return {
            id: "user-id",
            email: "exist@example.com",
            name: "Existing User",
            passwordHash: "hashed",
            createdAt: new Date(),
          };
        }
        return null;
      }),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockImplementation(async ({ data }) => {
        return { id: "new-id", ...data, createdAt: new Date() };
      }),
      update: vi
        .fn()
        .mockImplementation(async ({ data }) => ({ id: "user-id", ...data })),
      delete: vi.fn().mockResolvedValue({ id: "user-id" }),
    },
    project: {
      findUnique: vi
        .fn()
        .mockResolvedValue({ id: "proj1", title: "Project 1" }),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi
        .fn()
        .mockImplementation(async ({ data }) => ({
          id: "new-proj-id",
          ...data,
        })),
      update: vi
        .fn()
        .mockImplementation(async ({ data }) => ({ id: "proj1", ...data })),
      delete: vi.fn().mockResolvedValue({ id: "proj1" }),
    },
    script: {
      findUnique: vi
        .fn()
        .mockResolvedValue({ id: "script1", title: "Script 1", content: "{}" }),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi
        .fn()
        .mockImplementation(async ({ data }) => ({
          id: "new-script-id",
          ...data,
        })),
      update: vi
        .fn()
        .mockImplementation(async ({ data }) => ({ id: "script1", ...data })),
      delete: vi.fn().mockResolvedValue({ id: "script1" }),
    },
    snapshot: {
      findUnique: vi.fn(),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi
        .fn()
        .mockImplementation(async ({ data }) => ({ id: "snap1", ...data })),
      update: vi.fn(),
      delete: vi.fn(),
    },
    settings: {
      findUnique: vi
        .fn()
        .mockResolvedValue({
          id: "set1",
          userId: "user-id",
          openaiKey: "****1234",
        }),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi
        .fn()
        .mockImplementation(async ({ data }) => ({ id: "set1", ...data })),
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
    },
  };
});
