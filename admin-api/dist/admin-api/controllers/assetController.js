"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalValue = exports.updateUserAsset = exports.getUserAssets = exports.getAssets = exports.confirmDeposit = exports.getFeeHistory = exports.getDepositHistory = exports.getAssetSummary = exports.processMonthlyFees = exports.updateAssetStatus = exports.getAllAssets = void 0;
const Transaction_1 = require("../models/Transaction");
const feeService_1 = require("../services/feeService");
const UserAsset_1 = require("../models/UserAsset");
const Asset_1 = require("../models/Asset");
const user_model_1 = require("../models/user.model");
// 获取所有用户资产
const getAllAssets = async (req, res) => {
    try {
        const assets = await UserAsset_1.UserAsset.find()
            .populate('userId', 'email')
            .sort({ updatedAt: -1 });
        res.json(assets);
    }
    catch (error) {
        console.error('Error getting all assets:', error);
        res.status(500).json({ message: '获取资产列表失败' });
    }
};
exports.getAllAssets = getAllAssets;
// 更新资产状态
const updateAssetStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const asset = await UserAsset_1.UserAsset.findById(id);
        if (!asset) {
            return res.status(404).json({ message: '资产不存在' });
        }
        asset.status = status;
        await asset.save();
        res.json(asset);
    }
    catch (error) {
        console.error('Error updating asset status:', error);
        res.status(500).json({ message: '更新资产状态失败' });
    }
};
exports.updateAssetStatus = updateAssetStatus;
// 处理月度托管费
const processMonthlyFees = async (req, res) => {
    try {
        const users = await user_model_1.User.find({ isNewUser: false });
        const currentDate = new Date();
        for (const user of users) {
            const userAsset = await UserAsset_1.UserAsset.findOne({ userId: user._id });
            if (!userAsset)
                continue;
            // 检查是否需要扣除托管费
            const lastDeduction = userAsset.lastFeeDeduction || userAsset.createdAt;
            const monthsSinceLastDeduction = (currentDate.getTime() - lastDeduction.getTime()) / (1000 * 60 * 60 * 24 * 30);
            if (monthsSinceLastDeduction >= 1) {
                // 创建托管费记录
                const fee = await feeService_1.feeService.createFee(user._id.toString(), 30, 'monthly');
                // 更新用户资产
                userAsset.balance -= 30;
                userAsset.lastFeeDeduction = currentDate;
                await userAsset.save();
            }
        }
        res.json({ message: '托管费处理完成' });
    }
    catch (error) {
        console.error('Error processing monthly fees:', error);
        res.status(500).json({ message: '处理托管费失败' });
    }
};
exports.processMonthlyFees = processMonthlyFees;
const getAssetSummary = async (req, res) => {
    try {
        const summary = await UserAsset_1.UserAsset.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalValue: { $sum: '$value' }
                }
            }
        ]);
        res.json(summary);
    }
    catch (error) {
        console.error('Error getting asset summary:', error);
        res.status(500).json({ message: '获取资产统计失败' });
    }
};
exports.getAssetSummary = getAssetSummary;
const getDepositHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const deposits = await Transaction_1.Transaction.find({
            userId,
            type: 'deposit'
        }).sort({ createdAt: -1 });
        res.json(deposits);
    }
    catch (error) {
        console.error('Error getting deposit history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getDepositHistory = getDepositHistory;
const getFeeHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const fees = await Transaction_1.Transaction.find({
            userId,
            type: 'fee'
        }).sort({ createdAt: -1 });
        res.json(fees);
    }
    catch (error) {
        console.error('Error getting fee history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getFeeHistory = getFeeHistory;
const confirmDeposit = async (req, res) => {
    try {
        const { userId } = req.params;
        const { txHash, amount, chain } = req.body;
        if (!txHash || !amount || !chain) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const user = await user_model_1.User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await feeService_1.feeService.confirmDeposit(userId, txHash, amount, chain);
        res.json({ message: 'Deposit confirmed successfully' });
    }
    catch (error) {
        console.error('Error confirming deposit:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.confirmDeposit = confirmDeposit;
const getAssets = async (req, res) => {
    try {
        const assets = await Asset_1.Asset.find();
        res.json(assets);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get assets' });
    }
};
exports.getAssets = getAssets;
const getUserAssets = async (req, res) => {
    try {
        const userAssets = await UserAsset_1.UserAsset.find({ userId: req.user?._id });
        res.json(userAssets);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get user assets' });
    }
};
exports.getUserAssets = getUserAssets;
const updateUserAsset = async (req, res) => {
    try {
        const { assetId, amount } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const userAsset = await UserAsset_1.UserAsset.findOneAndUpdate({ userId, assetId }, { amount, lastUpdated: new Date() }, { new: true, upsert: true });
        res.json(userAsset);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update user asset' });
    }
};
exports.updateUserAsset = updateUserAsset;
const calculateTotalValue = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }
        const userAssets = await UserAsset_1.UserAsset.find({ userId });
        const assets = await Asset_1.Asset.find();
        const totalValue = userAssets.reduce((sum, userAsset) => {
            const asset = assets.find((a) => a._id.toString() === userAsset.assetId);
            return sum + (asset ? asset.price * userAsset.amount : 0);
        }, 0);
        res.json({ totalValue });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to calculate total value' });
    }
};
exports.calculateTotalValue = calculateTotalValue;
