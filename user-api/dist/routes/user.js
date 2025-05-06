"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_model_1 = require("../models/user.model");
const auth_1 = require("../middlewares/auth");
const transaction_model_1 = require("../models/transaction.model");
const hostingFee_model_1 = require("../models/hostingFee.model");
const commission_model_1 = require("../models/commission.model");
const mongoose_1 = __importDefault(require("mongoose"));
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticateToken, async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: '未授权' });
            return;
        }
        const user = await user_model_1.User.findById(new mongoose_1.default.Types.ObjectId(userId));
        if (!user) {
            res.status(404).json({ message: '用户不存在' });
            return;
        }
        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            status: user.status
        });
    }
    catch (error) {
        console.error('Error fetching user info:', error);
        res.status(500).json({ message: '获取用户信息失败' });
    }
});
router.get('/account-info', auth_1.authenticateToken, async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: '未授权' });
            return;
        }
        const user = await user_model_1.User.findById(new mongoose_1.default.Types.ObjectId(userId));
        if (!user) {
            res.status(404).json({ message: '用户不存在' });
            return;
        }
        const balanceHistory = await transaction_model_1.Transaction.find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .limit(10);
        const hostingFeeHistory = await hostingFee_model_1.HostingFee.find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .limit(10);
        const commissionHistory = await commission_model_1.Commission.find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({
            balance: user.balance,
            hostingFee: user.hostingFee,
            status: user.status,
            referralCode: user.referralCode,
            referralRewards: user.referralRewards,
            balanceHistory: balanceHistory.map(record => ({
                date: record.createdAt,
                amount: record.amount,
                type: record.type,
                description: record.description
            })),
            hostingFeeHistory: hostingFeeHistory.map(record => ({
                date: record.createdAt,
                amount: record.amount,
                status: record.status
            })),
            commissionHistory: commissionHistory.map(record => ({
                date: record.createdAt,
                amount: record.amount,
                type: record.type,
                fromUser: record.fromUser
            }))
        });
    }
    catch (error) {
        console.error('Error fetching account info:', error);
        res.status(500).json({ message: '获取账户信息失败' });
    }
});
router.get('/profile', auth_1.authenticateToken, async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: '未授权' });
            return;
        }
        const user = await user_model_1.User.findById(new mongoose_1.default.Types.ObjectId(userId));
        if (!user) {
            res.status(404).json({ message: '用户不存在' });
            return;
        }
        res.json({
            id: user._id,
            email: user.email,
            name: user.name,
            inviteCode: user.inviteCode,
            role: user.role
        });
    }
    catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: '获取个人信息失败' });
    }
});
router.put('/profile', auth_1.authenticateToken, async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: '未授权' });
            return;
        }
        const { username, email } = req.body;
        const user = await user_model_1.User.findById(new mongoose_1.default.Types.ObjectId(userId));
        if (!user) {
            res.status(404).json({ message: '用户不存在' });
            return;
        }
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        await user.save();
        res.json({ message: '个人信息更新成功' });
    }
    catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: '更新个人信息失败' });
    }
});
exports.userRouter = router;
//# sourceMappingURL=user.js.map