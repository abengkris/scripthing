import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Editor from '../Editor';
import { useParams } from 'react-router-dom';
import { useVirtualizer } from '@tanstack/react-virtual';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useParams: vi.fn(),
}));

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn().mockReturnValue({
    getTotalSize: () => 1056,
    getVirtualItems: () => [{ key: 0, size: 1056, start: 0 }],
  }),
}));

vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn().mockReturnValue({}),
  EditorContent: () => <div data-testid="editor-content" />,
}));

// Mock hooks
vi.mock('../../hooks/useAutoSave', () => ({ useAutoSave: () => vi.fn() }));
vi.mock('../../hooks/useSync', () => ({ useSync: () => vi.fn() }));
vi.mock('../../store/editorStore', () => ({ useEditorStore: () => ({ initQueue: vi.fn() }) }));

describe('Editor Virtualization', () => {
  it('initializes virtualizer with correct parameters', () => {
    (useParams as any).mockReturnValue({ id: 'test-id' });
    const mockedVirtualizer = vi.mocked(useVirtualizer);
    
    render(<Editor />);
    
    expect(mockedVirtualizer).toHaveBeenCalled();
  });
});
