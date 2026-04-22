import { create } from "zustand";
import { addToSyncQueue, getSyncQueue, removeFromSyncQueue } from "../lib/db";
export const useEditorStore = create((set) => ({
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
        const newItem = { id, scriptId, content, timestamp: Date.now() };
        set((state) => ({
            offlineQueue: [...state.offlineQueue, newItem],
            isDirty: true,
        }));
        return id;
    },
    removeFromQueue: async (id) => {
        await removeFromSyncQueue(id);
        set((state) => ({
            offlineQueue: state.offlineQueue.filter((item) => item.id !== id),
        }));
    },
}));
