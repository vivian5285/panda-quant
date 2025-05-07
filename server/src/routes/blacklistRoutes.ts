import express from 'express';
import type { Router } from 'express';
import { Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import { AuthenticatedRequest } from '../types/express';
import { blacklistController } from '../controllers/BlacklistController';

const router = express.Router();

// Protected routes
router.use(ensureAuthenticated);

// Get all blacklist entries
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await blacklistController.getAllEntries(req, res);
}));

// Get single blacklist entry
router.get('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await blacklistController.getEntryById(req, res);
}));

// Create blacklist entry
router.post('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await blacklistController.createEntry(req, res);
}));

// Update blacklist entry
router.put('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await blacklistController.updateEntry(req, res);
}));

// Delete blacklist entry
router.delete('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await blacklistController.deleteEntry(req, res);
}));

export default router; 