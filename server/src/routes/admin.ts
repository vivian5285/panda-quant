import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { AdminController } from '../controllers/AdminController';
import type { AuthenticatedRequest } from '../types/Auth';

const router: Router = express.Router();
const adminController = new AdminController();

// All admin routes require authentication and admin privileges
router.use(ensureAuthenticated);
router.use(adminMiddleware);

// Dashboard
router.get('/dashboard', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.getAdminDashboard(req, res);
}));

// User management
router.get('/users', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.getAllUsers(req, res);
}));

router.get('/users/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.getUserById(req, res);
}));

router.put('/users/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.updateUser(req, res);
}));

router.delete('/users/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.deleteUser(req, res);
}));

// System settings
router.get('/settings', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.getSettings(req, res);
}));

router.put('/settings', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.updateSettings(req, res);
}));

// System logs
router.get('/logs', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.getLogs(req, res);
}));

router.get('/logs/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await adminController.getLogById(req, res);
}));

export default router; 