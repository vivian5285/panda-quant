"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Auth_1 = require("../middleware/Auth");
const validator_1 = require("../middleware/validator");
const express_validator_1 = require("express-validator");
const User_1 = require("../controllers/User");
const router = (0, express_1.Router)();
const userController = new User_1.UserController();
// 用户注册
router.post('/register', (0, validator_1.validate)([
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    (0, express_validator_1.body)('name').notEmpty().withMessage('Name is required')
]), userController.register);
// 用户登录
router.post('/login', (0, validator_1.validate)([
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password').notEmpty().withMessage('Password is required')
]), userController.login);
// 获取当前用户信息
router.get('/me', Auth_1.authenticate, userController.getCurrentUser);
// 更新用户信息
router.put('/me', Auth_1.authenticate, (0, validator_1.validate)([
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Please provide a valid email')
]), userController.updateUser);
// 更改密码
router.put('/me/password', Auth_1.authenticate, (0, validator_1.validate)([
    (0, express_validator_1.body)('currentPassword').notEmpty().withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
]), userController.changePassword);
// 管理员路由
router.get('/', Auth_1.authenticate, (0, Auth_1.authorize)('admin'), userController.getAllUsers);
router.get('/:id', Auth_1.authenticate, (0, Auth_1.authorize)('admin'), userController.getUserById);
router.put('/:id', Auth_1.authenticate, (0, Auth_1.authorize)('admin'), (0, validator_1.validate)([
    (0, express_validator_1.body)('name').optional().notEmpty().withMessage('Name cannot be empty'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('role').optional().isIn(['user', 'admin']).withMessage('Invalid role')
]), userController.updateUserById);
router.delete('/:id', Auth_1.authenticate, (0, Auth_1.authorize)('admin'), userController.deleteUser);
exports.default = router;
//# sourceMappingURL=User.js.map