import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import http from 'http';
import path from 'path';
import swaggerUi from 'swagger-ui-express';

import createTables from './config/dbSetup.ts';
import { authMiddleware } from './middlewares/authMiddleware.ts';
import { sendErrorResponse } from './middlewares/errorResponseMiddleware.ts';
import { alarmRoutes } from './routes/alarmRoutes.ts';
import { authRoutes } from './routes/authRoutes.ts';
import { loadOpenApiYaml, __dirname } from './utils/utils.ts';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error(' JWT_SECRET is not defined!');
}

createTables();

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  }),
);

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(loadOpenApiYaml()));

app.use('/api/auth', authRoutes);
app.use('/api/alarms', authMiddleware, alarmRoutes);

app.use(sendErrorResponse);

const server = http.createServer(app);

if (process.env.NODE_ENV !== 'test') {
  server.listen(process.env.PORT ?? 3000, () => {
    console.log(`Server running on port ${process.env.PORT ?? '3000'}`);
  });
}

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(' Unhandled Server Error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export { app, server };
