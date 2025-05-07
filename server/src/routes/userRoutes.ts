import express from 'express';
import type { Router } from 'express';
import type { Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import type { AuthenticatedRequest } from '../types/express';
import { UserController } from '../controllers/UserController';

const router: Router = express.Router();
const userController = new UserController();

// Protected routes
router.use(ensureAuthenticated);

// Get all users
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userController.getAllUsers(req, res);
}));

// Get single user
router.get('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userController.getUserById(req, res);
}));

// Create user
router.post('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userController.register(req, res);
}));

// Update user
router.put('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userController.updateUser(req, res);
}));

// Delete user
router.delete('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userController.deleteUser(req, res);
}));

export default router;