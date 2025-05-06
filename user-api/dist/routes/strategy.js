"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const profitController_1 = require("../controllers/profitController");
const mongoose_1 = __importDefault(require("mongoose"));
const strategy_model_1 = require("../models/strategy.model");
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const strategyManager = req.app.get('strategyManager');
        const strategies = strategyManager.getAllStrategies();
        const strategyList = Array.from(strategies.values()).map((strategy) => strategy.getStats());
        return res.json({
            success: true,
            data: strategyList
        });
    }
    catch (error) {
        console.error('Error fetching strategies:', error);
        return res.status(500).json({
            success: false,
            message: '获取策略数据失败'
        });
    }
});
router.get('/user', auth_1.authenticateToken, async (req, res) => {
    try {
        const strategyManager = req.app.get('strategyManager');
        const strategies = strategyManager.getAllStrategies();
        const strategyList = Array.from(strategies.values()).map((strategy) => strategy.getStats());
        return res.json({
            success: true,
            data: strategyList
        });
    }
    catch (error) {
        console.error('Error fetching user strategies:', error);
        return res.status(500).json({
            success: false,
            message: '获取用户策略数据失败'
        });
    }
});
router.get('/risk/:level', async (req, res) => {
    try {
        const { level } = req.params;
        const strategyManager = req.app.get('strategyManager');
        const strategies = strategyManager.getAllStrategies();
        const strategyList = Array.from(strategies.values())
            .filter((strategy) => strategy.riskLevel === level)
            .map((strategy) => strategy.getStats());
        return res.json({
            success: true,
            data: strategyList
        });
    }
    catch (error) {
        console.error('Error fetching strategies by risk level:', error);
        return res.status(500).json({
            success: false,
            message: '获取策略数据失败'
        });
    }
});
router.post('/', auth_1.authenticateToken, async (req, res) => {
    var _a;
    try {
        const { name, description, parameters } = req.body;
        const strategy = new strategy_model_1.Strategy({
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
            name,
            description,
            parameters
        });
        await strategy.save();
        return res.status(201).json(strategy);
    }
    catch (error) {
        console.error('Error creating strategy:', error);
        return res.status(500).json({ message: 'Error creating strategy' });
    }
});
router.get('/:strategyId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { strategyId } = req.params;
        const strategyManager = req.app.get('strategyManager');
        const strategy = strategyManager.getStrategy(strategyId);
        return res.json({ success: true, data: strategy.getStats() });
    }
    catch (error) {
        console.error('Error getting strategy:', error);
        return res.status(500).json({
            success: false,
            message: '获取策略详情失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.delete('/:strategyId', auth_1.authenticateToken, async (req, res) => {
    try {
        const { strategyId } = req.params;
        const strategyManager = req.app.get('strategyManager');
        strategyManager.removeStrategy(strategyId);
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Error removing strategy:', error);
        return res.status(500).json({
            success: false,
            message: '删除策略失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.put('/:strategyId/params', auth_1.authenticateToken, async (req, res) => {
    try {
        const { strategyId } = req.params;
        const { params } = req.body;
        if (!params) {
            return res.status(400).json({
                success: false,
                message: '缺少策略参数'
            });
        }
        const strategyManager = req.app.get('strategyManager');
        const strategy = strategyManager.getStrategy(strategyId);
        strategy.updateParams(params);
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Error updating strategy params:', error);
        return res.status(500).json({
            success: false,
            message: '更新策略参数失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.get('/:strategyId/stats', auth_1.authenticateToken, async (req, res) => {
    try {
        const { strategyId } = req.params;
        const strategyManager = req.app.get('strategyManager');
        const strategy = strategyManager.getStrategy(strategyId);
        const stats = strategy.getStats();
        return res.json({ success: true, data: stats });
    }
    catch (error) {
        console.error('Error getting strategy stats:', error);
        return res.status(500).json({
            success: false,
            message: '获取策略统计数据失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
router.get('/user/profits', auth_1.authenticateToken, profitController_1.getUserProfitData);
router.get('/list', auth_1.authenticateToken, async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: '未授权' });
        }
        const { page = 1, limit = 20 } = req.query;
        const strategies = await strategy_model_1.Strategy.find({ userId: new mongoose_1.default.Types.ObjectId(userId) })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit));
        const total = await strategy_model_1.Strategy.countDocuments({ userId: new mongoose_1.default.Types.ObjectId(userId) });
        return res.json({
            strategies: strategies.map(strategy => ({
                id: strategy._id,
                name: strategy.name,
                description: strategy.description,
                parameters: strategy.parameters,
                createdAt: strategy.createdAt,
                updatedAt: strategy.updatedAt
            })),
            total,
            page: Number(page),
            limit: Number(limit)
        });
    }
    catch (error) {
        console.error('Error getting strategy list:', error);
        return res.status(500).json({
            success: false,
            message: '获取策略列表失败',
            error: error instanceof Error ? error.message : '未知错误'
        });
    }
});
exports.default = router;
//# sourceMappingURL=strategy.js.map