import { create } from "zustand";
import { addToSyncQueue, getSyncQueue, removeFromSyncQueue } from "../lib/db";

export type SaveStatus = "saved" | "saving" | "error" | "offline";

interface SyncItem {
  id: string;
  scriptId: string;
  content: unknown;
  timestamp: number;
}

interface EditorState {
  saveStatus: SaveStatus;
  lastSaved: number | null;
  isDirty: boolean;
  offlineQueue: SyncItem[];

  setSaveStatus: (status: SaveStatus) => void;
  setLastSaved: (timestamp: number) => void;
  setIsDirty: (isDirty: boolean) => void;

  initQueue: () => Promise<void>;
  addToQueue: (scriptId: string, content: unknown) => Promise<void>;
  removeFromQueue: (id: string) => Promise<void>;
}

export const useEditorStore = create<EditorState>((set) => ({
  saveStatus: "saved",
  lastSaved: null,
  isDirty: false,
  offlineQueue: [],

  setSaveStatus: (saveStatus) => set({ saveStatus }),
  setLastSaved: (lastSaved) => set({ lastSaved }),
  setIsDirty: (isDirty) => set({ isDirty }),

  initQueue: async () => {
    const queue = await getSyncQueue();
    set({ offlineQueue: queue });
  },

  addToQueue: async (scriptId, content) => {
    const id = await addToSyncQueue(scriptId, content);
    const newItem: SyncItem = { id, scriptId, content, timestamp: Date.now() };
    set((state) => ({
      offlineQueue: [...state.offlineQueue, newItem],
      isDirty: true,
    }));
  },

  removeFromQueue: async (id) => {
    await removeFromSyncQueue(id);
    set((state) => ({
      offlineQueue: state.offlineQueue.filter((item) => item.id !== id),
    }));
  },
}));
