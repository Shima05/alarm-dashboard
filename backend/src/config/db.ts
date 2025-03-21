import sqlite3 from 'sqlite3';
import path from 'path';

// Detect if the environment is test
const isTest = process.env.NODE_ENV === 'test';

// Select the appropriate database path
const dbPath = isTest
  ? path.resolve(process.cwd(), 'test.sqlite') // For Jest
  : path.resolve(process.cwd(), 'db.sqlite3'); // For production/dev

const db: sqlite3.Database = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(' Failed to connect to the database:', err.message);
  } else {
    console.log(' Successfully connected to SQLite database.');
  }
});

export default db;
