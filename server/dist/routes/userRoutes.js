"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const Auth_1 = require("../middleware/Auth");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
// 包装异步请求处理函数，增加错误处理
const handleRequest = (handler) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'Unauthorized' });
                return;
            }
            yield handler(req, res);
        }
        catch (error) {
            next(error);
        }
    });
};
// 应用认证中间件
router.use(authMiddleware_1.authMiddleware);
// Admin routes
router.get('/admin/users', Auth_1.authenticate, Auth_1.isAdmin, handleRequest((req, res) => userController.getAllUsers(req, res)));
router.get('/admin/users/:id', Auth_1.authenticate, Auth_1.isAdmin, handleRequest((req, res) => userController.getUserById(req, res)));
router.post('/admin/users', Auth_1.authenticate, Auth_1.isAdmin, handleRequest((req, res) => userController.register(req, res)));
router.put('/admin/users/:id', Auth_1.authenticate, Auth_1.isAdmin, handleRequest((req, res) => userController.updateUser(req, res)));
router.delete('/admin/users/:id', Auth_1.authenticate, Auth_1.isAdmin, handleRequest((req, res) => userController.deleteUser(req, res)));
// User routes
router.get('/profile', handleRequest((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.getProfile(req, res);
})));
router.put('/profile', handleRequest((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.updateProfile(req, res);
})));
router.delete('/me', handleRequest((req, res) => userController.deleteUser(req, res)));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map