"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
// 所有路由都需要管理员权限
router.use(auth_1.authenticateToken, auth_1.isAdmin);
// 获取用户列表
router.get('/', userController_1.getUsers);
// 更新用户状态
router.put('/:id/status', userController_1.updateUserStatus);
// 发放奖励
router.post('/:id/reward', userController_1.rewardUser);
exports.default = router;
