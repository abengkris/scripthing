import { buildApp } from '../app';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('App Bootstrap', () => {
  const app = buildApp();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should be initialized', async () => {
    expect(app).toBeDefined();
  });
});
