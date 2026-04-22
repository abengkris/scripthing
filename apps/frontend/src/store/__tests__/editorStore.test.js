import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEditorStore } from "../editorStore";
import * as db from "../../lib/db";
vi.mock("../../lib/db", () => ({
    addToSyncQueue: vi.fn().mockResolvedValue("test-id"),
    getSyncQueue: vi.fn().mockResolvedValue([]),
    removeFromSyncQueue: vi.fn().mockResolvedValue(undefined),
}));
describe("Editor Store", () => {
    beforeEach(() => {
        useEditorStore.setState({
            saveStatus: "saved",
            lastSaved: null,
            isDirty: false,
            offlineQueue: [],
        });
    });
    it("adds an item to the queue", async () => {
        await useEditorStore.getState().addToQueue("script-1", { text: "hello" });
        const state = useEditorStore.getState();
        expect(state.offlineQueue.length).toBe(1);
        expect(state.offlineQueue[0].scriptId).toBe("script-1");
        expect(state.isDirty).toBe(true);
        expect(db.addToSyncQueue).toHaveBeenCalledWith("script-1", {
            text: "hello",
        });
    });
    it("removes an item from the queue", async () => {
        useEditorStore.setState({
            offlineQueue: [
                { id: "test-id", scriptId: "s1", content: {}, timestamp: 123 },
            ],
        });
        await useEditorStore.getState().removeFromQueue("test-id");
        expect(useEditorStore.getState().offlineQueue.length).toBe(0);
        expect(db.removeFromSyncQueue).toHaveBeenCalledWith("test-id");
    });
});
