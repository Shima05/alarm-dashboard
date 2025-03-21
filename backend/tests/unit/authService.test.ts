import { AuthService } from '../../src/services/authService.ts';
import db from '../../src/config/db.ts';
import bcrypt from 'bcryptjs';

describe('🔹 AuthService Tests', () => {
  const testUser = { username: 'testuser', password: '123456' };

  beforeAll(async () => {
    process.env.JWT_SECRET = 'mySuperSecretKey123';
    await db.run('DELETE FROM users');

    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [testUser.username, hashedPassword]);
  });

  afterAll(async () => {
    await db.run('DELETE FROM users');
  });

  test('should register a new user and return a token', async () => {
    const newUser = { username: 'newuser', password: 'password' };
    const token = await AuthService.signup(newUser.username, newUser.password);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should login an existing user and return a token', async () => {
    const token = await AuthService.login(testUser.username, testUser.password);

    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  test('should throw an error when password is incorrect', async () => {
    await expect(AuthService.login(testUser.username, 'wrongpassword')).rejects.toThrow('Invalid username or password');
  });

  test('should throw an error when user does not exist', async () => {
    await expect(AuthService.login('nonexistent', 'any')).rejects.toThrow('Invalid username or password');
  });
});
