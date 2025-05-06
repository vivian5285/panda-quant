import { Router } from 'express';
import { authenticate, authorize } from '../middleware/Auth';
import { validate } from '../middleware/validator';
import { body } from 'express-validator';
import { UserController } from '../controllers/User';
const router = Router();
const userController = new UserController();
// 用户注册
router.post('/register', validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('name').notEmpty().withMessage('Name is required')
]), userController.register);
// 用户登录
router.post('/login', validate([
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required')
]), userController.login);
// 获取当前用户信息
router.get('/me', authenticate, userController.getCurrentUser);
// 更新用户信息
router.put('/me', authenticate, validate([
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email')
]), userController.updateUser);
// 更改密码
router.put('/me/password', authenticate, validate([
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
]), userController.changePassword);
// 管理员路由
router.get('/', authenticate, authorize('admin'), userController.getAllUsers);
router.get('/:id', authenticate, authorize('admin'), userController.getUserById);
router.put('/:id', authenticate, authorize('admin'), validate([
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Please provide a valid email'),
    body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
]), userController.updateUserById);
router.delete('/:id', authenticate, authorize('admin'), userController.deleteUser);
export default router;
//# sourceMappingURL=User.js.map