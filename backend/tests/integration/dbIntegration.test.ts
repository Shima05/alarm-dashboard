import request from 'supertest';
import { app } from '../../src/app.ts';
import db from '../../src/config/db.ts';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { Alarm } from '../../src/models/alarmModel.ts';

describe('🔹 Database Integration Tests', () => {
  const testAlarm = {
    uuid: uuidv4(),
    sensor: 'sensor_test',
    type: 'fire',
    visualizations: ['test-image.jpg'],
  };

  let authToken: string;

  beforeAll((done) => {
    db.run('DELETE FROM alarms', done);
    const secret = process.env.JWT_SECRET || 'defaultSecret';
    authToken = jwt.sign({ id: 'userId', username: 'testuser' }, secret, { expiresIn: '1h' });
  });

  afterAll((done) => {
    db.run('DELETE FROM alarms', done);
  });

  test('Should store and retrieve an alarm from the database', async () => {
    // Insert into database
    await new Promise<void>((resolve, reject) => {
      db.run(
        `INSERT INTO alarms (uuid, sensor, timestamp, type, visualizations) VALUES (?, ?, ?, ?, ?)`,
        [testAlarm.uuid, testAlarm.sensor, Date.now(), testAlarm.type, JSON.stringify(testAlarm.visualizations)],
        function (err) {
          if (err) {
            console.error(' DB Insert Error:', err);
            reject(err);
          } else {
            resolve();
          }
        },
      );
    });

    // Fetch from database
    const alarm = await new Promise<Alarm>((resolve, reject) => {
      db.get(`SELECT * FROM alarms WHERE uuid = ?`, [testAlarm.uuid], (err, row) => {
        if (err) {
          console.error(' DB Select Error:', err);
          reject(err);
        } else {
          resolve(row as Alarm);
        }
      });
    });

    expect(alarm).toBeDefined();
    expect(alarm.uuid).toBe(testAlarm.uuid);
    expect(alarm.sensor).toBe(testAlarm.sensor);
    expect(alarm.type).toBe(testAlarm.type);

    const parsedVisualizations = typeof alarm.visualizations === 'string' ? JSON.parse(alarm.visualizations) : alarm.visualizations;

    expect(parsedVisualizations).toEqual(testAlarm.visualizations);
  });

  test('Should retrieve alarm via API (GET /api/alarms/:id)', async () => {
    const response = await request(app).get(`/api/alarms/${testAlarm.uuid}`).set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.uuid).toBe(testAlarm.uuid);
    expect(response.body.sensor).toBe(testAlarm.sensor);
    expect(response.body.type).toBe(testAlarm.type);

    const visualizations = typeof response.body.visualizations === 'string' ? JSON.parse(response.body.visualizations) : response.body.visualizations;
  });
});
