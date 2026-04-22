import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { config } from "./config";
import { errorMiddleware } from "./middleware/error.middleware";
import { privacyMiddleware } from "./middleware/privacy.middleware";
import authRoutes from "./routes/auth";
import { projectRoutes } from "./routes/projects";
import { scriptRoutes } from "./routes/scripts";
import { settingsRoutes } from "./routes/settings";
import { aiRoutes } from "./routes/ai";

export const buildApp = () => {
  const isProd = config.NODE_ENV === "production";
  const fastify = Fastify({
    logger: isProd
      ? {
          level: "info",
        }
      : {
          level: "debug",
          transport: {
            target: "pino-pretty",
          },
        },
  });

  fastify.register(helmet);

  fastify.register(cors, {
    origin: config.FRONTEND_URL,
    credentials: true,
  });

  errorMiddleware(fastify);
  privacyMiddleware(fastify);

  fastify.get("/api/v1/health", async () => ({ status: "ok" }));

  // Routes
  fastify.register(authRoutes, { prefix: "/api/v1/auth" });
  fastify.register(projectRoutes, { prefix: "/api/v1/projects" });
  fastify.register(scriptRoutes, { prefix: "/api/v1" }); // Prefix handled in file for nested
  fastify.register(settingsRoutes, { prefix: "/api/v1/settings" });
  fastify.register(aiRoutes, { prefix: "/api/v1/ai" });

  return fastify;
};
