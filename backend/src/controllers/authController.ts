import { Request, Response } from 'express';
import { AuthService } from '../services/authService.ts';
import type { paths } from '../generated/types.ts';
import db from '../config/db.ts';

type SignupRouteBody = paths['/api/auth/signup']['post']['requestBody']['content']['application/json'];
type LoginRouteBody = paths['/api/auth/login']['post']['requestBody']['content']['application/json'];

export const AuthController = {
  login: async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as LoginRouteBody;

    try {
      const token = await AuthService.login(username, password);

      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: 'Login failed', details: error.message });
        return;
      }
      res.status(400).json({ error: 'Login failed' });
    }
  },

  signup: async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body as SignupRouteBody;

    try {
      const existingUser = await new Promise<any>((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
          if (err) return reject(err);
          resolve(row);
        });
      });

      if (existingUser) {
        res.status(400).json({ error: 'User already exists' });
        return;
      }

      const token = await AuthService.signup(username, password);
      res.status(201).json({ token });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: 'Signup failed', details: error.message });
        return;
      }
      res.status(400).json({ error: 'Signup failed' });
    }
  },
};
