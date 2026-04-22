import { FastifyInstance, FastifyRequest } from "fastify";

export const privacyMiddleware = (fastify: FastifyInstance) => {
  fastify.addHook("preHandler", async (request: FastifyRequest) => {
    // Mask sensitive fields in the request body if they exist
    if (request.body && typeof request.body === "object") {
      const sensitiveFields = [
        "password",
        "accessToken",
        "refreshToken",
        "apiKey",
      ];
      const body = request.body as Record<string, unknown>;

      for (const field of sensitiveFields) {
        if (field in body) {
          body[field] = "***MASKED***";
        }
      }
    }
  });
};
