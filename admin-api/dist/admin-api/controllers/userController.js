"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rewardUser = exports.updateUserStatus = exports.getUsers = void 0;
const user_model_1 = require("../models/user.model");
const transaction_model_1 = __importDefault(require("../models/transaction.model"));
// 获取所有用户
const getUsers = async (req, res) => {
    try {
        const users = await user_model_1.User.find()
            .select('email balance deductionCredit status')
            .sort({ createdAt: -1 });
        res.json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getUsers = getUsers;
// 更新用户状态
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        // 验证状态值
        if (!['active', 'insufficient_balance', 'suspended'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const user = await user_model_1.User.findByIdAndUpdate(id, { status }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    }
    catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.updateUserStatus = updateUserStatus;
// 发放奖励
const rewardUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid reward amount' });
        }
        const user = await user_model_1.User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // 开始事务
        const session = await user_model_1.User.startSession();
        session.startTransaction();
        try {
            // 更新用户余额
            user.balance += amount;
            await user.save({ session });
            // 创建交易记录
            const transaction = new transaction_model_1.default({
                userId: user._id,
                type: 'reward',
                amount,
                status: 'completed',
                description: 'Admin reward'
            });
            await transaction.save({ session });
            // 提交事务
            await session.commitTransaction();
            session.endSession();
            res.json({ message: 'Reward successful', user });
        }
        catch (error) {
            // 回滚事务
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
    catch (error) {
        console.error('Error rewarding user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.rewardUser = rewardUser;
