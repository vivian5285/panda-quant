import { StrategyEngine } from './StrategyEngine';
import { SuperTrendStrategy } from './strategies/superTrendStrategy';
import { DatabaseService } from '../user-api/services/databaseService';

// 初始化数据库服务
DatabaseService.initialize();

// 创建策略引擎实例
const engine = new StrategyEngine();

// 添加SuperTrend策略
const superTrendPreset = {
  name: 'SuperTrend',
  params: {
    period: 10,
    multiplier: 3,
    stopLoss: 0.02,
    takeProfit: 0.05
  }
};

engine.addStrategy(superTrendPreset);

// 启动策略引擎
engine.start();

// 导出策略引擎实例
export { engine }; 