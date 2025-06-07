import { getDatabase } from './index';

// Get all counts
export const getAllCounts = async (callback) => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync('SELECT zekrID, count FROM counts;');

    const counts = {};
    for (const row of rows) {
      counts[row.zekrID] = row.count;
    }

    callback(counts);
  } catch (error) {
    console.error('Error fetching counts:', error);
  }
};

// Save a count
export const saveCount = async (zekrID, count) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO counts (zekrID, count) VALUES (?, ?);',
      zekrID,
      count
    );
  } catch (error) {
    console.error('Error saving count:', error);
  }
};

// Reset a count
export const resetCount = async (zekrID) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE counts SET count = 0 WHERE zekrID = ?;',
      zekrID
    );
  } catch (error) {
    console.error('Error resetting count:', error);
  }
};

// Get all sebha counts
export const getAllSebhaCounts = async () => {
  try {
    const db = await getDatabase();
    const rows = await db.getAllAsync('SELECT sebhaID, count FROM sebha_counts;');
    const counts = {};
    for (const row of rows) {
      counts[row.sebhaID] = row.count;
    }
    return counts;
  } catch (error) {
    console.error('Error fetching sebha counts:', error);
    return {};
  }
};

// Save a sebha count
export const saveSebhaCount = async (sebhaID, count) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT OR REPLACE INTO sebha_counts (sebhaID, count) VALUES (?, ?);',
      sebhaID,
      count
    );
  } catch (error) {
    console.error('Error saving sebha count:', error);
  }
};

// Reset a sebha count
export const resetSebhaCount = async (sebhaID) => {
  try {
    const db = await getDatabase();
    await db.runAsync(
      'UPDATE sebha_counts SET count = 0 WHERE sebhaID = ?;',
      sebhaID
    );
  } catch (error) {
    console.error('Error resetting sebha count:', error);
  }
};