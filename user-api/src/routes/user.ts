import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();
const userController = new UserController();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

export default router; 