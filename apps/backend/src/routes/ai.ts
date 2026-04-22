import { FastifyInstance } from "fastify";
import { z } from "zod";
import { validate } from "../middleware/validation.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import * as aiService from "../services/ai/ai.service";
import { prisma } from "../db";

const chatSchema = z.object({
  provider: z.string(),
  model: z.string(),
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant", "system"]),
      content: z.string(),
    }),
  ),
  temperature: z.number().optional(),
  maxTokens: z.number().optional(),
  stream: z.boolean().optional().default(false),
});

const testProviderSchema = z.object({
  provider: z.string(),
});

interface ChatRequest {
  provider: string;
  model: string;
  messages: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export const aiRoutes = async (app: FastifyInstance) => {
  app.addHook("preHandler", authMiddleware);

  // POST /ai/chat
  app.post(
    "/chat",
    { preHandler: validate(chatSchema) },
    async (request, reply) => {
      const { provider, model, messages, temperature, maxTokens, stream } =
        request.body as ChatRequest;
      const userId = request.userId;

      if (stream) {
        // Set SSE headers
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");
        reply.raw.flushHeaders();

        const aiStream = aiService.completeStream(prisma, userId, provider, {
          model,
          messages,
          temperature,
          maxTokens,
          stream: true,
        });

        for await (const chunk of aiStream) {
          reply.raw.write(`data: ${JSON.stringify(chunk)}\n\n`);
        }

        reply.raw.write("data: [DONE]\n\n");
        reply.raw.end();
        return reply;
      } else {
        const result = await aiService.complete(prisma, userId, provider, {
          model,
          messages,
          temperature,
          maxTokens,
          stream: false,
        });
        return { success: true, data: result };
      }
    },
  );

  // POST /ai/test
  app.post(
    "/test",
    { preHandler: validate(testProviderSchema) },
    async (request) => {
      const { provider } = request.body as { provider: string };
      const success = await aiService.testProvider(
        prisma,
        request.userId,
        provider,
      );
      return { success };
    },
  );

  // GET /ai/models
  app.get("/models", async () => {
    return { success: true, data: aiService.getModels() };
  });
};
