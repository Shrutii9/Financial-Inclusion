import { openDB } from 'idb';

const DB_NAME = 'UserDB';
const STORE_NAME = 'users';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'email' });
      }
    },
  });
}

export async function addUser(user) {
  const db = await initDB();
  await db.put(STORE_NAME, user);
}

export async function getUser(email) {
  const db = await initDB();
  return await db.get(STORE_NAME, email);
}