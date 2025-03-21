import db from './db.ts';

const logError = (message: string, error: Error): void => {
  console.error(`${message}: ${error.message}`);
};

const createTables = (): void => {
  db.serialize(() => {
    // Create users table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      )
    `,
      (err: Error | null) => {
        if (err) {
          logError('Error creating users table', err);
        } else {
          console.log('User table created successfully.');
        }
      },
    );

    // Create alarms table
    db.run(
      `CREATE TABLE IF NOT EXISTS alarms (
        uuid TEXT PRIMARY KEY,
        sensor TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        type TEXT NOT NULL,
        visualizations TEXT DEFAULT '[]'
      )`,
      (err: Error | null) => {
        if (err) {
          logError(' Error creating alarms table', err);
        } else {
          console.log(' Alarm table updated successfully.');
        }
      },
    );
  });
};

export default createTables;
