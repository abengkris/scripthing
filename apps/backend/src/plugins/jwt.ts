import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { config } from '../config';

export default fp(async (fastify) => {
  if (!config.APP_SECRET) {
    throw new Error('APP_SECRET must be defined in environment variables');
  }
  
  fastify.register(jwt, {
    secret: config.APP_SECRET
  });
});
