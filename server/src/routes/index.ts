import { Router } from 'express';
import authRoutes from './authRoutes';
import userRoutes from './userRoutes';
import withdrawalRoutes from './withdrawalRoutes';
import commissionRoutes from './commissionRoutes';
import userLevelRoutes from './userLevelRoutes';
import blacklistRoutes from './blacklistRoutes';
import adminRoutes from './admin';
import strategyRoutes from './strategy';
import settlementRoutes from './settlement';
import { authenticate } from '../middleware/auth';
import { UserController } from '../controllers/userController';
import { AuthController } from '../controllers/authController';
import { handleRequest } from '../utils/requestHandler';

const router = Router();
const userController = new UserController();
const authController = new AuthController();

// Public routes (no authentication required)
router.post('/login', handleRequest((req, res) => authController.login(req, res)));
router.post('/register', handleRequest((req, res) => authController.register(req, res)));

// Protected routes (require authentication)
router.use(authenticate);

// 设置路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/withdrawals', withdrawalRoutes);
router.use('/commissions', commissionRoutes);
router.use('/user-levels', userLevelRoutes);
router.use('/blacklist', blacklistRoutes);
router.use('/admin', adminRoutes);
router.use('/strategies', strategyRoutes);
router.use('/settlement', settlementRoutes);

// 用户路由
router.get('/profile', handleRequest((req, res) => userController.getProfile(req, res)));
router.put('/profile', handleRequest((req, res) => userController.updateProfile(req, res)));
router.get('/me', handleRequest((req, res) => authController.getCurrentUser(req, res)));

export default router; 