import { FastifyInstance } from "fastify";
import { z } from "zod";
import { validate } from "../middleware/validation.middleware";

const settingsSchema = z.object({
  theme: z.enum(["light", "dark"]).optional(),
  fontSize: z.number().min(8).max(24).optional(),
  fontFamily: z.string().optional(),
});

export const settingsRoutes = async (app: FastifyInstance) => {
  // GET /settings
  app.get("/", async () => {
    return { theme: "dark", fontSize: 12, fontFamily: "Courier Prime" }; // Mock
  });

  // PUT /settings
  app.put("/", { preHandler: validate(settingsSchema) }, async (_request) => {
    // TODO: Add DB integration
    return { message: "Settings updated" };
  });
};
