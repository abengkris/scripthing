import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { validate } from '../middleware/validation.middleware';

const scriptSchema = z.object({
  title: z.string().min(1),
  content: z.string(), // JSON string
});

export const scriptRoutes = async (app: FastifyInstance) => {
  // GET /api/v1/projects/:projectId/scripts
  app.get('/projects/:projectId/scripts', async (request) => {
    const { projectId } = request.params as { projectId: string };
    return { scripts: [] }; // Mock
  });

  // POST /api/v1/projects/:projectId/scripts
  app.post('/projects/:projectId/scripts', { preHandler: validate(scriptSchema) }, async (request, reply) => {
    reply.status(201).send({ message: 'Script created' });
  });

  // GET /api/v1/scripts/:id
  app.get('/scripts/:id', async (request) => {
    const { id } = request.params as { id: string };
    return { id, title: 'Mock Script', content: '{}' };
  });

  // POST /api/v1/scripts/:id/snapshot
  app.post('/scripts/:id/snapshot', async (request, reply) => {
    reply.status(201).send({ message: 'Snapshot saved' });
  });

  // POST /api/v1/scripts/:id/export/pdf
  app.post('/scripts/:id/export/pdf', async (request, reply) => {
    const { id } = request.params as { id: string };
    // Fetch script from DB (mock for now)
    const script = { title: 'Sample Screenplay', author: 'Author Name', content: '<p class="scene-heading">INT. CAFE - DAY</p><p class="action">The sun shines through the window.</p>' };

    const { generatePdf } = await import('../services/export.service');
    const pdfBuffer = await generatePdf(script);

    reply
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="${script.title}.pdf"`)
      .send(pdfBuffer);
  });

  // POST /api/v1/scripts/:id/export/fdx
  app.post('/scripts/:id/export/fdx', async (request, reply) => {
    const { id } = request.params as { id: string };
    // Fetch script from DB (mock for now)
    const script = { title: 'Sample Screenplay', author: 'Author Name', content: {} };

    const { generateFdx } = await import('../services/export.service');
    const fdxContent = await generateFdx(script);

    reply
      .header('Content-Type', 'application/xml')
      .header('Content-Disposition', `attachment; filename="${script.title}.fdx"`)
      .send(fdxContent);
  });
};
