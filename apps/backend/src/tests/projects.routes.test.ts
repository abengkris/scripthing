import { projectRoutes } from '../routes/projects';
import { buildApp } from '../app';
import { describe, it, expect, beforeAll } from 'vitest';

describe('Project Routes', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.register(projectRoutes, { prefix: '/projects' });
  });

  it('should list projects', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/projects',
    });
    expect(res.statusCode).toBe(200);
    expect(JSON.parse(res.payload)).toHaveProperty('projects');
  });

  it('should create a project', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/projects',
      payload: { title: 'Test Project' },
    });
    expect(res.statusCode).toBe(201);
  });
});
