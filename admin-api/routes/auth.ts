import express from 'express';
import { login } from '../controllers/authController';

const router = express.Router();

// 登录
router.post('/login', login);

export default router; 