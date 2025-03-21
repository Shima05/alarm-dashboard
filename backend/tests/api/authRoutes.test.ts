// tests/api/authRoutes.test.ts
import request from 'supertest';
import { app, server } from '../../src/app.ts';
import { AuthService } from '../../src/services/authService.ts';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';

dotenv.config({ path: '.env' });

jest.mock('../../src/services/authService');

const mockToken = `Bearer ${jwt.sign({ userId: 'test_user' }, process.env.JWT_SECRET ?? 'mytestsecret', {
  expiresIn: '1h',
})}`;

describe('🔹 Auth API Tests', () => {
  let db: sqlite3.Database;

  beforeAll((done) => {
    db = new sqlite3.Database(process.env.DATABASE_URL || './test.sqlite', (err) => {
      if (err) {
        console.error('Failed to open database:', err);
      } else {
        console.log('Database connected');
        db.run(
          `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
          )`,
          (err) => {
            if (err) {
              console.error('Failed to create users table:', err);
            } else {
              console.log('Users table ready');
            }
            done();
          },
        );
      }
    });
  });

  beforeEach((done) => {
    db.run('DELETE FROM users', (err) => {
      if (err) {
        console.error('Failed to clear users table:', err);
      } else {
        console.log('🗑 Users table cleared');
      }
      done();
    });
  });

  afterAll((done) => {
    db.close((err) => {
      if (err) {
        console.error('Failed to close database:', err);
      } else {
        console.log('Database connection closed');
      }
      server.close(() => {
        console.log('Server closed after all tests.');
        done();
      });
    });
  });

  test('should sign up a new user (POST /api/auth/signup)', async () => {
    const newUser = { username: `user_${Math.floor(Math.random() * 10000)}`, password: '123456' };

    (AuthService.signup as jest.Mock).mockResolvedValue(mockToken);

    const response = await request(app).post('/api/auth/signup').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body.token).toBeDefined();
    expect(response.body.token).toBe(mockToken);
  });

  test('should login a user and return a token (POST /api/auth/login)', async () => {
    const credentials = { username: 'test_user', password: '123456' };

    (AuthService.login as jest.Mock).mockResolvedValue(mockToken);

    const response = await request(app).post('/api/auth/login').send(credentials);

    expect(response.status).toBe(200);
    expect(response.body.token).toBeDefined();
    expect(response.body.token).toBe(mockToken);
  });
});
