import express from 'express';
import { handleRequest } from '../middleware/errorHandler';
import type { Request, Response } from 'express';

const router = express.Router();

router.get('/', handleRequest(async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}));

export default router; 