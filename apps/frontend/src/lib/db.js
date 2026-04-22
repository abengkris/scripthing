import { openDB } from "idb";
let dbPromise;
const getDB = () => {
    if (!dbPromise) {
        dbPromise = openDB("scripthing-editor", 1, {
            upgrade(db) {
                const store = db.createObjectStore("sync-queue", {
                    keyPath: "id",
                });
                store.createIndex("by-timestamp", "timestamp");
            },
        });
    }
    return dbPromise;
};
export const addToSyncQueue = async (scriptId, content) => {
    const db = await getDB();
    const id = crypto.randomUUID();
    await db.put("sync-queue", {
        id,
        scriptId,
        content,
        timestamp: Date.now(),
    });
    return id;
};
export const getSyncQueue = async () => {
    const db = await getDB();
    return db.getAllFromIndex("sync-queue", "by-timestamp");
};
export const removeFromSyncQueue = async (id) => {
    const db = await getDB();
    await db.delete("sync-queue", id);
};
export const clearSyncQueue = async () => {
    const db = await getDB();
    await db.clear("sync-queue");
};
