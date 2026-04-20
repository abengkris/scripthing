// apps/backend/src/routes/ai.ts
import { FastifyInstance } from 'fastify';
import { AIService } from '../services/ai/ai.service';

export default async function (fastify: FastifyInstance) {
  const aiService = new AIService();

  fastify.post('/ai/chat', async (request, reply) => {
    const { provider, apiKey, messages } = request.body as any;
    // In a real app, we would fetch the API key from the DB using the user ID
    // but for this implementation we accept it in the request body for simplicity
    
    return await aiService.complete(provider, apiKey, {
      messages,
      model: 'gemini-2.0-flash',
    });
  fastify.post('/ai/analyze', async (request, reply) => {
    const { provider, apiKey, content } = request.body as any;
    
    // In a real app, we would fetch the API key from the DB using the user ID
    const providerInstance = new AIService() as any; // Quick hack for demonstration
    // This is incomplete, needs actual service method delegation.
    return { success: true, analysis: "Analysis result placeholder." };
  });
}
