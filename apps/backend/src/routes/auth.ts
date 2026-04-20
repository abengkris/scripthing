import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';

export default async function (fastify: FastifyInstance) {
  fastify.post('/auth/register', async (request, reply) => {
    const { email, password, name } = request.body as any;
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await fastify.prisma.user.create({
      data: { email, passwordHash, name },
    });
    
    return { id: user.id, email: user.email };
  });

  fastify.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as any;
    const user = await fastify.prisma.user.findUnique({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    
    const token = fastify.jwt.sign({ id: user.id, email: user.email });
    return { token };
  });
}
