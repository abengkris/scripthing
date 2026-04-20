import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const setupErrorMiddleware = (app: FastifyInstance) => {
  app.setErrorHandler((error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    // If it's a Fastify default error (like 404), return it as is or handle specifically
    const statusCode = (error as any).statusCode || 500;
    
    if (statusCode >= 400 && statusCode < 500) {
      reply.status(statusCode).send({ error: error.message });
      return;
    }

    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ error: error.message });
      return;
    }

    app.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  });
};
