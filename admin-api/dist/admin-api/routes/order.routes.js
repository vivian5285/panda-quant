"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const order_model_1 = require("../models/order.model");
const user_model_1 = require("../models/user.model");
const strategy_model_1 = require("../models/strategy.model");
const validateObjectId_1 = require("../middleware/validateObjectId");
const router = express_1.default.Router();
// 获取订单列表（带分页和筛选）
router.get('/', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const { page = 1, limit = 10, type, status } = req.query;
        const query = {};
        if (type)
            query.type = type;
        if (status)
            query.status = status;
        const orders = await order_model_1.Order.find(query)
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .populate('userId', 'email');
        const total = await order_model_1.Order.countDocuments(query);
        res.json({
            orders,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit)),
        });
    }
    catch (error) {
        res.status(500).json({ message: '获取订单列表失败' });
    }
});
// 获取单个订单
router.get('/:id', [auth_1.authenticateAdmin, validateObjectId_1.validateObjectId], async (req, res) => {
    try {
        const order = await order_model_1.Order.findById(req.params.id)
            .populate('userId', 'email');
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: '获取订单详情失败' });
    }
});
// 创建订单
router.post('/', auth_1.authenticateAdmin, async (req, res) => {
    try {
        const { userId, strategyId, amount, months } = req.body;
        // 验证用户和策略是否存在
        const user = await user_model_1.User.findById(userId);
        const strategy = await strategy_model_1.Strategy.findById(strategyId);
        if (!user || !strategy) {
            return res.status(404).json({ message: '用户或策略不存在' });
        }
        const order = new order_model_1.Order({
            userId,
            strategyId,
            amount,
            months,
            status: 'pending'
        });
        await order.save();
        res.status(201).json(order);
    }
    catch (error) {
        res.status(500).json({ message: '创建订单失败' });
    }
});
// 更新订单状态
router.patch('/:id/status', [auth_1.authenticateAdmin, validateObjectId_1.validateObjectId], async (req, res) => {
    try {
        const { status } = req.body;
        const order = await order_model_1.Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ message: '更新订单状态失败' });
    }
});
// 审核提现请求
router.put('/withdrawal/:id/approve', [auth_1.authenticateAdmin, validateObjectId_1.validateObjectId], async (req, res) => {
    try {
        const { id } = req.params;
        const { status, remark } = req.body;
        const order = await order_model_1.Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        if (order.type !== 'withdrawal') {
            return res.status(400).json({ message: '非提现订单' });
        }
        order.status = status;
        order.remark = remark;
        await order.save();
        res.json({ message: '审核成功' });
    }
    catch (error) {
        res.status(500).json({ message: '审核失败' });
    }
});
// 删除订单
router.delete('/:id', [auth_1.authenticateAdmin, validateObjectId_1.validateObjectId], async (req, res) => {
    try {
        const order = await order_model_1.Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ message: '订单不存在' });
        }
        res.json({ message: '订单已删除' });
    }
    catch (error) {
        res.status(500).json({ message: '删除订单失败' });
    }
});
exports.default = router;
