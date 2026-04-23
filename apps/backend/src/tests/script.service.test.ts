import { describe, it, expect, vi } from "vitest";
import * as scriptService from "../services/script.service";

describe("Script Service", () => {
  const prismaMock = {
    script: {
      create: vi
        .fn()
        .mockImplementation(({ data }) =>
          Promise.resolve({ id: "s1", ...data }),
        ),
      findMany: vi.fn().mockResolvedValue([{ id: "s1", title: "S1" }]),
      findUnique: vi.fn().mockResolvedValue({ id: "s1", title: "S1" }),
      update: vi
        .fn()
        .mockImplementation(({ data }) =>
          Promise.resolve({ id: "s1", ...data }),
        ),
      delete: vi.fn().mockResolvedValue({ id: "s1" }),
    },
  };

  it("should create a script", async () => {
    const data = { title: "New Script" };
    const result = await scriptService.createScript(
      prismaMock as any,
      "p1",
      data as any,
    );
    expect(result.title).toBe("New Script");
    expect(result.projectId).toBe("p1");
  });

  it("should list scripts", async () => {
    const result = await scriptService.listScripts(prismaMock as any, "p1");
    expect(result).toHaveLength(1);
  });

  it("should get a script", async () => {
    const result = await scriptService.getScript(prismaMock as any, "s1");
    expect(result?.id).toBe("s1");
  });

  it("should update a script", async () => {
    const result = await scriptService.updateScript(prismaMock as any, "s1", {
      title: "Updated",
    });
    expect(result.title).toBe("Updated");
  });

  it("should delete a script", async () => {
    const result = await scriptService.deleteScript(prismaMock as any, "s1");
    expect(result.id).toBe("s1");
  });
});
