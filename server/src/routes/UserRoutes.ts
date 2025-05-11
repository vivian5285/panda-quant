import express from 'express';
import type { Router } from 'express';
import type { Response } from 'express';
import { handleRequest } from '../utils/RequestHandler';
import { ensureAuthenticated } from '../middleware/EnsureAuthenticated';
import { AuthenticatedRequest } from '../types/Auth';
import { UserController } from '../controllers/UserController';
import { validateRequest, validateParams } from '../validations/Common';
import { createUserSchema, updateUserSchema, userIdSchema } from '../validations/schemas/User';

const router: Router = express.Router();
const userController = new UserController();

// Protected routes
router.use(ensureAuthenticated);

// Get all users
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await userController.getAllUsers(req, res);
}));

// Get single user
router.get('/:id', 
  validateParams(userIdSchema),
  handleRequest(async (req: AuthenticatedRequest, res: Response) => {
    await userController.getUserById(req, res);
  })
);

// Create user
router.post('/', 
  validateRequest(createUserSchema),
  handleRequest(async (req: AuthenticatedRequest, res: Response) => {
    await userController.register(req, res);
  })
);

// Update user
router.put('/:id', 
  validateParams(userIdSchema),
  validateRequest(updateUserSchema),
  handleRequest(async (req: AuthenticatedRequest, res: Response) => {
    await userController.updateUser(req, res);
  })
);

// Delete user
router.delete('/:id', 
  validateParams(userIdSchema),
  handleRequest(async (req: AuthenticatedRequest, res: Response) => {
    await userController.deleteUser(req, res);
  })
);

export default router;