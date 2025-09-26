import * as SQLite from 'expo-sqlite';

// Async function to get the database instance
let dbPromise = null;

export async function getDatabase() {
  if (!dbPromise) {
    dbPromise = await SQLite.openDatabaseAsync('app.db');
  }
  return dbPromise;
}
