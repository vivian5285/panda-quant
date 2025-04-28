import { StrategyStats } from '../../strategy-engine/types';

/**
 * 策略参数接口
 * 定义了交易策略的基本参数类型
 */
export interface StrategyParameters {
  /** ATR周期，用于计算平均真实范围 */
  atrPeriod?: number;
  /** 乘数，用于计算止损和止盈 */
  multiplier?: number;
  /** 趋势强度过滤器，用于过滤弱趋势 */
  trendStrengthFilter?: number;
  /** 仓位大小，表示每次交易的数量 */
  positionSize?: number;
  /** 止损百分比 */
  stopLoss?: number;
  /** 止盈百分比 */
  takeProfit?: number;
  /** 允许其他自定义参数 */
  [key: string]: any;
}

/**
 * 策略预设接口
 * 定义了策略模板的基本属性
 */
export interface StrategyPreset {
  /** 策略名称 */
  name: string;
  /** 策略描述 */
  description: string;
  /** 风险等级 */
  riskLevel: 'high' | 'medium' | 'low';
  /** 预期收益率 */
  expectedReturn: number;
  /** 是否激活 */
  active: boolean;
  /** 策略参数 */
  parameters: StrategyParameters;
}

/**
 * 策略接口
 * 定义了具体策略实例的属性和方法
 */
export interface Strategy {
  /** 策略ID */
  id: string;
  /** 策略名称 */
  name: string;
  /** 策略描述 */
  description: string;
  /** 风险等级 */
  riskLevel: 'high' | 'medium' | 'low';
  /** 预期收益率 */
  expectedReturn: number;
  /** 是否激活 */
  active: boolean;
  /** 策略参数 */
  parameters: StrategyParameters;
  /** 更新策略参数 */
  updateParams(params: StrategyParameters): void;
  /** 获取策略统计信息 */
  getStats(): Promise<StrategyStats>;
}

/**
 * OHLCV数据接口
 * 定义了K线数据的基本结构
 */
export interface OHLCV {
  /** 时间戳 */
  timestamp: number;
  /** 开盘价 */
  open: number;
  /** 最高价 */
  high: number;
  /** 最低价 */
  low: number;
  /** 收盘价 */
  close: number;
  /** 成交量 */
  volume: number;
} 