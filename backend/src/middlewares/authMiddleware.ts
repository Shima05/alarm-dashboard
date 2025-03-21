import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export interface CustomRequest extends Request {
  token?: string | JwtPayload;
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.header('Authorization');

  if (!authHeader?.startsWith('Bearer ')) {
    console.warn(' No or invalid Authorization header');
    res.status(403).json({ error: 'Authorization token required' });
    return;
  }

  const token = authHeader.replace('Bearer ', '');
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('Missing JWT_SECRET in environment');
    res.status(500).json({ error: 'Server configuration error' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    (req as CustomRequest).token = decoded;

    next();
  } catch (error) {
    console.error('JWT verification error:', error);
    res.status(401).json({
      error: error instanceof Error ? error.message : 'Invalid or expired token',
    });
  }
}
