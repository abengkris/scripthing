import { describe, it, expect } from "vitest";
import { buildApp } from "../app";

describe("Logging", () => {
  it("should use structured pino logging", async () => {
    // Simple check to see if the logger instance exists and has pino methods
    const app = buildApp();
    const logger = app.log;

    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.error).toBe("function");
  });
});
