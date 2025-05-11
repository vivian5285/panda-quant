import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { handleRequest } from '../utils/RequestHandler';
import { ensureAuthenticated } from '../middleware/EnsureAuthenticated';
import { adminMiddleware } from '../middleware/AdminMiddleware';
import { blacklistController } from '../controllers/BlacklistController';
import type { AuthenticatedRequest } from '../types/Auth';

const router: Router = express.Router();

// All blacklist routes require authentication and admin privileges
router.use(ensureAuthenticated);
router.use(adminMiddleware);

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

// Search blacklist entries
router.get('/search', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await blacklistController.searchEntries(req, res);
}));

export default router; 