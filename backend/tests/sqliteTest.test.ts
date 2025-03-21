import sqlite3 from 'sqlite3';

test('SQLite3 should load without error', () => {
  expect(typeof sqlite3).toBe('object');
});
