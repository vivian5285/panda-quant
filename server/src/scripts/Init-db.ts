import mongoose from 'mongoose';
import { config } from '../Config';
import { logger } from '../utils/Logger';

// 导入所有模型
import '../models/user.model';
import '../models/strategy.model';
import '../models/order.model';
import '../models/trade.model';
import '../models/position.model';
import '../models/commission.model';
import '../models/commission-rule.model';
import '../models/commission-withdrawal.model';
import '../models/commission-record.model';
import '../models/withdrawal.model';
import '../models/deposit.model';
import '../models/deposit-notification.model';
import '../models/health.model';
import '../models/network-status.model';
import '../models/notification.model';
import '../models/performance.model';
import '../models/platform-earning.model';
import '../models/risk-event.model';
import '../models/settings.model';
import '../models/strategy-performance.model';
import '../models/strategy-rating.model';
import '../models/strategy-review.model';
import '../models/transaction.model';
import '../models/user-earning.model';
import '../models/user-level.model';

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