import express from 'express';
import type { Router } from 'express';
import userRoutes from './userRoutes';
import strategyRoutes from './strategyRoutes';
import authRoutes from './authRoutes';
import settlementRoutes from './settlement.routes';
import commissionRoutes from './commissionRoutes';
import withdrawalRoutes from './withdrawalRoutes';
import userLevelRoutes from './userLevelRoutes';
import blacklistRoutes from './blacklistRoutes';
import adminRoutes from './admin';
import profitRoutes from './profitRoutes';
import healthRoutes from './health';

const router: Router = express.Router();

// Health check route
router.use('/health', healthRoutes);

// Auth routes
router.use('/auth', authRoutes);

// User routes
router.use('/users', userRoutes);

// Strategy routes
router.use('/strategies', strategyRoutes);

// Settlement routes
router.use('/settlements', settlementRoutes);

// Commission routes
router.use('/commissions', commissionRoutes);

// Withdrawal routes
router.use('/withdrawals', withdrawalRoutes);

// User level routes
router.use('/user-levels', userLevelRoutes);

// Blacklist routes
router.use('/blacklist', blacklistRoutes);

// Admin routes
router.use('/admin', adminRoutes);

// Profit routes
router.use('/profits', profitRoutes);

export default router; 