import express, { Request, Response } from 'express';
import { authenticateAdmin } from '../middleware/auth';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import { Strategy } from '../models/strategy.model';
import { validateObjectId } from '../middleware/validateObjectId';

const router = express.Router();

// 获取订单列表（带分页和筛选）
router.get('/', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, type, status } = req.query;
    const query: any = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('userId', 'email');

    const total = await Order.countDocuments(query);

    res.json({
      orders,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ message: '获取订单列表失败' });
  }
});

// 获取单个订单
router.get('/:id', [authenticateAdmin, validateObjectId], async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'email');
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: '获取订单详情失败' });
  }
});

// 创建订单
router.post('/', authenticateAdmin, async (req: Request, res: Response) => {
  try {
    const { userId, strategyId, amount, months } = req.body;

    // 验证用户和策略是否存在
    const user = await User.findById(userId);
    const strategy = await Strategy.findById(strategyId);
    if (!user || !strategy) {
      return res.status(404).json({ message: '用户或策略不存在' });
    }

    const order = new Order({
      userId,
      strategyId,
      amount,
      months,
      status: 'pending'
    });

    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: '创建订单失败' });
  }
});

// 更新订单状态
router.patch('/:id/status', [authenticateAdmin, validateObjectId], async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: '更新订单状态失败' });
  }
});

// 审核提现请求
router.put('/withdrawal/:id/approve', [authenticateAdmin, validateObjectId], async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;

    const order = await Order.findById(id);
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
  } catch (error) {
    res.status(500).json({ message: '审核失败' });
  }
});

// 删除订单
router.delete('/:id', [authenticateAdmin, validateObjectId], async (req: Request, res: Response) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    res.json({ message: '订单已删除' });
  } catch (error) {
    res.status(500).json({ message: '删除订单失败' });
  }
});

export default router; 