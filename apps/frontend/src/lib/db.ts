import { openDB, DBSchema, IDBPDatabase } from "idb";

interface EditorDB extends DBSchema {
  "sync-queue": {
    key: string;
    value: {
      id: string;
      scriptId: string;
      content: unknown;
      timestamp: number;
    };
    indexes: { "by-timestamp": number };
  };
}

let dbPromise: Promise<IDBPDatabase<EditorDB>>;

const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<EditorDB>("scripthing-editor", 1, {
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

export const addToSyncQueue = async (scriptId: string, content: unknown) => {
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

export const removeFromSyncQueue = async (id: string) => {
  const db = await getDB();
  await db.delete("sync-queue", id);
};

export const clearSyncQueue = async () => {
  const db = await getDB();
  await db.clear("sync-queue");
};
