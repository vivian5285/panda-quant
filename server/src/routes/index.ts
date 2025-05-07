import express, { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import adminRoutes from './admin';
import healthRoutes from './health';
import profitRoutes from './profitRoutes';
import settlementRoutes from './settlement.routes';
import strategyRoutes from './Strategy';
import { authenticate } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.use('/auth', authRoutes);
router.use('/health', healthRoutes);

// Protected routes
router.use('/users', authenticate, userRoutes);
router.use('/admin', authenticate, adminRoutes);
router.use('/profit', authenticate, profitRoutes);
router.use('/settlement', authenticate, settlementRoutes);
router.use('/strategy', authenticate, strategyRoutes);

export default router; 