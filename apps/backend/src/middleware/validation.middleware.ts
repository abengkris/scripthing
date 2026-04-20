import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodSchema } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { AppError } from './error.middleware';

export const validate = (schema: ZodSchema) => {
  return async (request: FastifyRequest, _reply: FastifyReply) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
      throw new AppError(400, fromZodError(result.error).message);
    }
    request.body = result.data;
  };
};
