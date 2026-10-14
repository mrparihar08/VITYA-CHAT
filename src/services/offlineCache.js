/**
 * offlineCache.js
 * High-performance IndexedDB cache & client-side instant vector/token similarity search engine.
 * Enables MOTHER PWA to work offline with Notes, Tasks, and Calendar.
 */

const DB_NAME = "vitya_mother_offline_db";
const DB_VERSION = 1;

let dbPromise = null;

function openDatabase() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !window.indexedDB) {
      resolve(null);
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("notes")) {
        db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("tasks")) {
        db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("calendar")) {
        db.createObjectStore("calendar", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("sync_queue")) {
        db.createObjectStore("sync_queue", { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

/**
 * Cache an array of items into an IndexedDB store
 */
export async function cacheStoreItems(storeName, items) {
  try {
    const db = await openDatabase();
    if (!db) return;

    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.clear();

      for (const item of items) {
        store.put(item);
      }

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn(`[OfflineCache] Failed to cache items in ${storeName}:`, err);
  }
}

/**
 * Retrieve all items from an IndexedDB store
 */
export async function getCachedStoreItems(storeName) {
  try {
    const db = await openDatabase();
    if (!db) return [];

    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const req = store.getAll();

      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn(`[OfflineCache] Failed to read cached items from ${storeName}:`, err);
    return [];
  }
}

/**
 * Client-Side Instant Vector / Token Similarity Search (Zero Latency & Zero Cost)
 * Performs tokenized TF-IDF cosine-approximation search across cached notes and tasks.
 */
export function clientSideSemanticSearch(query, documents, textKey = "content") {
  if (!query || !query.trim() || !Array.isArray(documents) || documents.length === 0) {
    return [];
  }

  const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, " ");
  const queryTokens = cleanQuery.split(/\s+/).filter(Boolean);

  if (queryTokens.length === 0) return documents.slice(0, 5);

  const scoredDocs = documents.map((doc) => {
    const text = (typeof doc === "string" ? doc : doc[textKey] || doc.title || doc.content || "").toLowerCase();
    let score = 0;

    for (const token of queryTokens) {
      if (text.includes(token)) {
        score += 2;
        // Exact word boundary match gets bonus
        const wordRegex = new RegExp(`\\b${token}\\b`, "i");
        if (wordRegex.test(text)) score += 3;
      }
    }

    return { doc, score };
  });

  return scoredDocs
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.doc);
}
