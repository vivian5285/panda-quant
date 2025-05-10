import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../utils/logger';

// 导入所有模型
import '../models/user.model';
import '../models/strategy.model';
import '../models/order.model';
import '../models/trade.model';
import '../models/position.model';
import '../models/performance.model';
import '../models/notification.model';
import '../models/commission.model';
import '../models/withdrawal.model';
import '../models/settings.model';

async function initDatabase() {
  try {
    // 连接到 MongoDB
    await mongoose.connect(config.mongodb.adminUri);
    logger.info('Connected to MongoDB');

    // 获取所有模型
    const models = mongoose.models;

    // 创建所有集合
    for (const [modelName, model] of Object.entries(models)) {
      try {
        await model.createCollection();
        logger.info(`Created collection for ${modelName}`);
      } catch (error) {
        logger.error(`Error creating collection for ${modelName}:`, error);
      }
    }

    logger.info('Database initialization completed');
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

// 执行初始化
initDatabase().catch(console.error); 