import { getDatabase } from './index';

export const setupDatabase = async () => {
  const db = await getDatabase();

  // Create the counts table for Azkar (existing)
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS counts (
      zekrID INTEGER PRIMARY KEY NOT NULL,
      count INTEGER
    );
  `);

  // Create the counts table for Sebha
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS sebha_counts (
      sebhaID INTEGER PRIMARY KEY NOT NULL,
      count INTEGER
    );
  `);
};
