import { IUserLevel } from '../models/userLevel';

export function validateUserLevel(levelData: Partial<IUserLevel>): string | null {
  // 验证必填字段
  if (!levelData.name) {
    return '等级名称是必需的';
  }
  if (!levelData.description) {
    return '等级描述是必需的';
  }
  if (!levelData.benefits || levelData.benefits.length === 0) {
    return '至少需要一个等级权益';
  }
  if (!levelData.requirements) {
    return '等级要求是必需的';
  }

  // 验证名称长度
  if (levelData.name && (levelData.name.length < 2 || levelData.name.length > 50)) {
    return '等级名称长度必须在2-50个字符之间';
  }

  // 验证描述长度
  if (levelData.description && (levelData.description.length < 10 || levelData.description.length > 500)) {
    return '等级描述长度必须在10-500个字符之间';
  }

  // 验证权益
  if (levelData.benefits) {
    for (const benefit of levelData.benefits) {
      if (benefit.length < 2 || benefit.length > 100) {
        return '权益描述长度必须在2-100个字符之间';
      }
    }
  }

  // 验证要求
  if (levelData.requirements) {
    const { minBalance, minTradingVolume, minHoldingTime } = levelData.requirements;

    if (minBalance !== undefined && minBalance < 0) {
      return '最低余额不能小于0';
    }

    if (minTradingVolume !== undefined && minTradingVolume < 0) {
      return '最低交易量不能小于0';
    }

    if (minHoldingTime !== undefined && minHoldingTime < 0) {
      return '最低持仓时间不能小于0';
    }
  }

  return null;
} 