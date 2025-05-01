"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
// 公共路由
router.post('/login', async (req, res, next) => {
    try {
        await userController.login(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/register', async (req, res, next) => {
    try {
        await userController.register(req, res);
    }
    catch (error) {
        next(error);
    }
});
// 需要认证的路由
router.use(authMiddleware_1.authMiddleware);
router.post('/change-password', async (req, res, next) => {
    try {
        await userController.changePassword(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/profile', async (req, res, next) => {
    try {
        await userController.getProfile(req, res);
    }
    catch (error) {
        next(error);
    }
});
// 管理员路由
router.use(adminMiddleware_1.adminMiddleware);
router.get('/users', async (req, res, next) => {
    try {
        await userController.getAllUsers(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/users/:id', async (req, res, next) => {
    try {
        await userController.getUserById(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.post('/users', async (req, res, next) => {
    try {
        await userController.register(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/users/:id', async (req, res, next) => {
    try {
        await userController.updateUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/users/:id', async (req, res, next) => {
    try {
        await userController.deleteUser(req, res);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=user.js.map