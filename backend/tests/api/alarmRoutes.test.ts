import request from 'supertest';
import { app } from '../../src/app.ts';
import { AlarmService } from '../../src/services/alarmService.ts';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

dotenv.config({ path: '.env' });

// Prevent ENOENT errors when mocking path joins
jest.mock('path', () => {
  const actualPath = jest.requireActual<typeof import('path')>('path');
  return {
    ...actualPath,
    join: (...args: string[]) => {
      const validArgs = args.filter((arg) => typeof arg === 'string' && arg.trim() !== '');
      if (!validArgs.length) {
        console.warn(' Warning: path.join received invalid arguments:', args);
        return actualPath.join(process.cwd(), 'default_path');
      }
      return actualPath.join(process.cwd(), ...validArgs);
    },
  };
});

// Valid UUID for test data
const validUuid = uuidv4();

// Mocks
jest.mock('../../src/config/db', () => require('../__mocks__/db'));
jest.mock('../../src/services/alarmService');
jest.mock('../../src/utils/utils', () => ({
  loadOpenApiYaml: jest.fn().mockReturnValue({}),
}));

// Generate valid JWT token
const authToken = `Bearer ${jwt.sign({ userId: 'testuser' }, process.env.JWT_SECRET ?? 'mytestsecret', { expiresIn: '1h' })}`;

describe('🔹 Alarm API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test(' should fetch alarm list (GET /api/alarms)', async () => {
    const mockAlarms = [
      { uuid: uuidv4(), sensor: 'Sensor-A', timestamp: Date.now(), type: 'fire', visualizations: [] },
      { uuid: uuidv4(), sensor: 'Sensor-B', timestamp: Date.now(), type: 'smoke', visualizations: [] },
    ];

    (AlarmService.getAlarms as jest.Mock).mockResolvedValue(mockAlarms);

    const res = await request(app).get('/api/alarms').set('Authorization', authToken);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAlarms);
  });

  test('should fetch specific alarm by ID (GET /api/alarms/:id)', async () => {
    const mockAlarm = { uuid: validUuid, sensor: 'Sensor-A', timestamp: Date.now(), type: 'fire', visualizations: [] };

    (AlarmService.getAlarmById as jest.Mock).mockResolvedValue(mockAlarm);

    const res = await request(app).get(`/api/alarms/${validUuid}`).set('Authorization', authToken);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAlarm);
  });

  test('should create new alarm (POST /api/alarms)', async () => {
    const newAlarm = { uuid: validUuid, sensor: 'Sensor-C', timestamp: Date.now(), type: 'motion' };

    (AlarmService.createAlarm as jest.Mock).mockResolvedValue({ ...newAlarm, visualizations: [] });

    const res = await request(app).post('/api/alarms').set('Authorization', authToken).send(newAlarm);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ ...newAlarm, visualizations: [] });
  });
});
