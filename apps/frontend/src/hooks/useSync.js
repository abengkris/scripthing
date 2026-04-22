import { useEffect, useCallback } from "react";
import { useEditorStore } from "../store/editorStore";
import { api } from "../lib/api";
export const useSync = () => {
    const { offlineQueue, removeFromQueue, setSaveStatus } = useEditorStore();
    const processSyncQueue = useCallback(async () => {
        if (offlineQueue.length === 0)
            return;
        setSaveStatus("saving");
        // Sort by timestamp to ensure we save in order
        const sortedQueue = [...offlineQueue].sort((a, b) => a.timestamp - b.timestamp);
        for (const item of sortedQueue) {
            try {
                await api.put(`/scripts/${item.scriptId}`, { content: item.content });
                await removeFromQueue(item.id);
            }
            catch (error) {
                console.error(`Failed to sync item ${item.id}:`, error);
                setSaveStatus("error");
                return; // Stop processing if one fails
            }
        }
        setSaveStatus("saved");
    }, [offlineQueue, removeFromQueue, setSaveStatus]);
    useEffect(() => {
        const handleOnline = () => {
            processSyncQueue();
        };
        const handleFocus = () => {
            processSyncQueue();
        };
        window.addEventListener("online", handleOnline);
        window.addEventListener("focus", handleFocus);
        // Initial check
        if (navigator.onLine) {
            processSyncQueue();
        }
        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("focus", handleFocus);
        };
    }, [processSyncQueue]);
    return { processSyncQueue };
};
