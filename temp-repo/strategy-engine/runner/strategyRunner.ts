import { StrategyPreset, strategyPresets } from '../config/strategiesConfig';

export type RiskLevel = 'high' | 'medium' | 'low';

export function getStrategyParams(strategyName: string, riskLevel: RiskLevel): StrategyPreset {
  const strategy = strategyPresets[strategyName];
  if (!strategy) {
    throw new Error(`Strategy ${strategyName} not found`);
  }
  
  const params = strategy[riskLevel];
  if (!params) {
    throw new Error(`Risk level ${riskLevel} not found for strategy ${strategyName}`);
  }
  
  return params;
}

export function validateStrategyParams(params: StrategyPreset): boolean {
  // 验证参数是否在合理范围内
  if (params.takeProfit && params.takeProfit <= 0) return false;
  if (params.stopLoss && params.stopLoss <= 0) return false;
  if (params.maxTradesPerDay && params.maxTradesPerDay <= 0) return false;
  if (params.atrPeriod && params.atrPeriod <= 0) return false;
  if (params.multiplier && params.multiplier <= 0) return false;
  if (params.gridLevels && params.gridLevels <= 0) return false;
  if (params.rangePercent && params.rangePercent <= 0) return false;
  if (params.basePositionSize && params.basePositionSize <= 0) return false;
  
  return true;
}

export function getExpectedMonthlyReturn(strategyName: string, riskLevel: RiskLevel): number {
  // 根据策略和风险等级返回预期月化收益率
  const expectedReturns = {
    scalping: {
      high: 300,
      medium: 150,
      low: 100,
    },
    superTrend: {
      high: 200,
      medium: 100,
      low: 50,
    },
    grid: {
      high: 150,
      medium: 80,
      low: 40,
    },
  };
  
  return expectedReturns[strategyName]?.[riskLevel] || 0;
} 