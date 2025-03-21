import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  errors?: unknown[];
}

export function sendErrorResponse(err: CustomError, _req: Request, res: Response, next: NextFunction): void {
  console.error(' Error Handler:', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    errors: err.errors ?? [],
  });
}
