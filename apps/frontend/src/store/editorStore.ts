import { create } from 'zustand';

interface EditorState {
  content: string;
  setContent: (content: string) => void;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  content: '',
  setContent: (content) => set({ content }),
  isSaving: false,
  setIsSaving: (isSaving) => set({ isSaving }),
}));
