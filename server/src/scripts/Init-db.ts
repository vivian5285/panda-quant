import mongoose from 'mongoose';
import { config } from '../Config';
import { logger } from '../utils/Logger';
import { DatabaseError } from '../utils/Errors';

// Import models with correct casing
import '../models/User.model';
import '../models/Strategy.model';
import '../models/Order.model';
import '../models/Trade.model';
import '../models/Position.model';
import '../models/Commission.model';
import '../models/CommissionRule.model';
import '../models/CommissionWithdrawal.model';
import '../models/CommissionRecord.model';
import '../models/Withdrawal.model';
import '../models/Deposit.model';
import '../models/DepositNotification.model';
import '../models/Health.model';
import '../models/NetworkStatus.model';
import '../models/Notification.model';
import '../models/Performance.model';
import '../models/PlatformEarning.model';
import '../models/RiskEvent.model';
import '../models/Settings.model';
import '../models/StrategyPerformance.model';
import '../models/StrategyRating.model';
import '../models/StrategyReview.model';
import '../models/Transaction.model';
import '../models/UserEarning.model';
import '../models/UserLevel.model';
import '../models/Profit.model';

async function initDatabase() {
  try {
    // 连接到 MongoDB
    await mongoose.connect(config.mongoUri);
    logger.info('Connected to MongoDB');

    // 获取所有模型
    const models = mongoose.models;

    // 为每个模型创建集合
    for (const [modelName, model] of Object.entries(models)) {
      try {
        await model.createCollection();
        logger.info(`Created collection for model: ${modelName}`);
      } catch (error) {
        logger.error(`Error creating collection for model ${modelName}:`, error);
      }
    }

    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Error initializing database:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

// 执行初始化
initDatabase().catch(error => {
  logger.error('Failed to initialize database:', error);
  process.exit(1);
}); 