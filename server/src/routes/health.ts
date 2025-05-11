import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { healthController } from '../types/../controllers/HealthController';
import type { AuthenticatedRequest } from '../types/express';

const router: Router = express.Router();

// Health check endpoint
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await healthController.checkHealth(req, res);
}));

export default router; 