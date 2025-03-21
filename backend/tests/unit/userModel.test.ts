import { Database } from 'sqlite';
import { setupTestDB } from '../setup.ts';
import bcrypt from 'bcryptjs';

let db: Database;

beforeAll(async () => {
  db = await setupTestDB();
});

afterAll(async () => {
  await db.close();
});

test('should store and retrieve a user from the database', async () => {
  const hashedPassword = await bcrypt.hash('securepassword', 10);

  // Insert user into the database
  await db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['testuser', hashedPassword]);

  // Retrieve user from the database
  const user = await db.get(`SELECT * FROM users WHERE username = ?`, ['testuser']);

  // Assert user exists
  expect(user).toBeDefined();
  expect(user.username).toBe('testuser');

  // Password should be hashed
  const isPasswordValid = await bcrypt.compare('securepassword', user.password);
  expect(isPasswordValid).toBe(true);
});
