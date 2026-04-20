import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const setupErrorMiddleware = (app: FastifyInstance) => {
  app.setErrorHandler((error: Error, _request: FastifyRequest, reply: FastifyReply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ error: error.message });
      return;
    }

    app.log.error(error);
    reply.status(500).send({ error: 'Internal Server Error' });
  });
};
