import { Request, Response } from 'express';
import { Strategy as StrategyModel, IStrategy } from '../models/strategy.model';
import { Profit } from '../models/profit.model';
import { AuthRequest } from '../types/auth';
import { ObjectId } from 'mongodb';

// 计算每日收益
const calculateDailyProfit = async (userId: string, strategyId: string, date: Date) => {
  const strategy = await StrategyModel.findById(strategyId) as IStrategy;
  if (!strategy) {
    throw new Error('策略不存在');
  }

  // 获取前一天的收益数据
  const previousDay = new Date(date);
  previousDay.setDate(previousDay.getDate() - 1);

  const previousProfit = await Profit.findOne({
    userId,
    strategyId,
    date: previousDay
  });

  // 计算当日收益（这里使用简单的随机算法模拟，实际应用中应该使用真实的交易数据）
  const baseProfit = strategy.expectedReturn / 30; // 将月收益转换为日收益
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8-1.2 的随机因子
  const dailyProfit = baseProfit * randomFactor;

  // 计算总收益
  const totalProfit = previousProfit 
    ? previousProfit.totalProfit + dailyProfit 
    : dailyProfit;

  return {
    profit: dailyProfit,
    totalProfit
  };
};

// 获取用户收益数据
export const getUserProfitData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: '用户未认证'
      });
    }

    // 获取最近30天的日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    // 查询用户的所有活跃策略
    const strategies = await StrategyModel.find({ active: true });

    // 获取每个策略的收益数据
    const profits = await Promise.all(
      strategies.map(async (strategy) => {
        const strategyProfits = await Profit.find({
          userId,
          strategyId: strategy._id,
          date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 });

        return {
          strategyId: strategy._id,
          strategyName: strategy.name,
          profits: strategyProfits.map(p => ({
            date: p.date,
            profit: p.profit,
            totalProfit: p.totalProfit
          }))
        };
      })
    );

    res.json({
      success: true,
      data: profits
    });
  } catch (error) {
    console.error('Error fetching user profits:', error);
    res.status(500).json({
      success: false,
      message: '获取收益数据失败'
    });
  }
};

// 更新每日收益
export const updateDailyProfits = async () => {
  try {
    const strategies = await StrategyModel.find({ active: true });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const strategy of strategies) {
      // 获取使用该策略的所有用户
      const strategyId = typeof strategy._id === 'string' ? new ObjectId(strategy._id) : strategy._id;
      const uniqueUserIds = await Profit.distinct('userId', { strategyId });

      for (const userId of uniqueUserIds) {
        // 检查是否已存在今日收益记录
        const existingProfit = await Profit.findOne({
          userId,
          strategyId,
          date: today
        });

        if (!existingProfit) {
          const { profit, totalProfit } = await calculateDailyProfit(
            userId,
            (strategyId as ObjectId).toString(),
            today
          );

          await Profit.create({
            userId,
            strategyId,
            date: today,
            profit,
            totalProfit
          });
        }
      }
    }
  } catch (error) {
    console.error('Error updating daily profits:', error);
  }
}; 