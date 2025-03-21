import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { setupTestDB } from '../setup.ts';

let db: Database;

beforeAll(async () => {
  db = await setupTestDB();
});

afterAll(async () => {
  await db.close();
});

test('Should store and retrieve an alarm from the database', async () => {
  const testUuid = '1234';

  await db.run(`INSERT INTO alarms (uuid, sensor, timestamp, type, visualizations) VALUES (?, ?, ?, ?, ?)`, [
    testUuid,
    'sensor_1',
    Date.now(),
    'fire',
    JSON.stringify(['image1.jpg']),
  ]);

  const alarm = await db.get(`SELECT * FROM alarms WHERE uuid = ?`, [testUuid]);

  expect(alarm).toBeDefined();
  expect(alarm.uuid).toBe(testUuid);
  expect(alarm.sensor).toBe('sensor_1');
  expect(alarm.type).toBe('fire');
  expect(JSON.parse(alarm.visualizations)).toEqual(['image1.jpg']);
});
