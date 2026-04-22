import { describe, it, expect, vi } from 'vitest';
import * as projectService from '../services/project.service';

describe('Project Service', () => {
  const prismaMock = {
    project: {
      create: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'new-id', ...data })),
      findMany: vi.fn().mockResolvedValue([{ id: 'p1', title: 'P1' }]),
      findUnique: vi.fn().mockResolvedValue({ id: 'p1', title: 'P1' }),
      update: vi.fn().mockImplementation(({ data }) => Promise.resolve({ id: 'p1', ...data })),
      delete: vi.fn().mockResolvedValue({ id: 'p1' }),
    }
  };

  it('should create a project', async () => {
    const data = { title: 'Test Project' };
    const result = await projectService.createProject(prismaMock, 'user-id', data);
    expect(result.title).toBe('Test Project');
    expect(result.userId).toBe('user-id');
  });

  it('should list projects', async () => {
    const result = await projectService.listProjects(prismaMock, 'user-id');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('P1');
  });

  it('should get a project', async () => {
    const result = await projectService.getProject(prismaMock, 'p1');
    expect(result.id).toBe('p1');
  });

  it('should update a project', async () => {
    const result = await projectService.updateProject(prismaMock, 'p1', { title: 'Updated' });
    expect(result.title).toBe('Updated');
  });

  it('should delete a project', async () => {
    const result = await projectService.deleteProject(prismaMock, 'p1');
    expect(result.id).toBe('p1');
  });
});
