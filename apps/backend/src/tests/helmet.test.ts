import { describe, it, expect } from "vitest";
import { buildApp } from "../app";

describe("Security Headers", () => {
  const app = buildApp();

  it("should have security headers enabled", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/health",
    });

    // Helmet defaults (note: fastify injection headers are lowercased)
    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
  });
});
