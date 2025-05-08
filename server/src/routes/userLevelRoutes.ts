import express, { Router } from 'express';
import { Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import { AuthenticatedRequest } from '../types/express';
import { UserLevelController } from '../controllers/UserLevelController';

const router: Router = express.Router();
const userLevelController = new UserLevelController();

// Protected routes
router.use(ensureAuthenticated);

// Get all user levels
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userLevelController.getAllLevels(req, res);
}));

// Get single user level
router.get('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userLevelController.getUserLevel(req, res);
}));

// Create user level
router.post('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userLevelController.createLevel(req, res);
}));

// Update user level
router.put('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userLevelController.updateLevel(req, res);
}));

// Delete user level
router.delete('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userLevelController.deleteLevel(req, res);
}));

export default router; 