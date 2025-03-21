import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.ts';
import { User } from '../models/userModel.ts';

const getUserByUsername = (username: string): Promise<User | undefined> => {
  return new Promise((resolve, reject) => {
    db.get<User>(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
      if (err) return reject(err);
      resolve(user);
    });
  });
};

const insertNewUser = (username: string, hashedPassword: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
      if (err) return reject(err);
      resolve(this.lastID);
    });
  });
};

export const AuthService = {
  login: async (username: string, password: string): Promise<string> => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const user = await getUserByUsername(username);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new Error('Invalid username or password');
    }

    return jwt.sign({ id: user.id, username: user.username }, secret, {
      expiresIn: '1h',
    });
  },

  signup: async (username: string, password: string): Promise<string> => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not defined');

    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const userId = await insertNewUser(username, hashedPassword);

    return jwt.sign({ id: userId, username }, secret, {
      expiresIn: '1h',
    });
  },
};
