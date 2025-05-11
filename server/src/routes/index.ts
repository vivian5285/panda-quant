import express from 'express';
import type { Router } from 'express';
import userRoutes from './UserRoutes';
import strategyRoutes from './StrategyRoutes';
import authRoutes from './AuthRoutes';
import settlementRoutes from './Settlement.routes';
import commissionRoutes from './CommissionRoutes';
import withdrawalRoutes from './WithdrawalRoutes';
import userLevelRoutes from './UserLevelRoutes';
import blacklistRoutes from './BlacklistRoutes';
import adminRoutes from './Admin';
import profitRoutes from './ProfitRoutes';
import healthRoutes from './Health';

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