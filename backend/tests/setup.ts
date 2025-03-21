import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Setup in-memory test database
export const setupTestDB = async (): Promise<Database> => {
  const db = await open({
    filename: ':memory:',
    driver: sqlite3.Database,
  });

  // Create users table
  await db.exec(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
  `);

  // Create alarms table
  await db.exec(`
    CREATE TABLE alarms (
      uuid TEXT PRIMARY KEY,
      sensor TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      type TEXT NOT NULL,
      visualizations TEXT DEFAULT '[]'
    );
  `);

  return db;
};

export default setupTestDB;
