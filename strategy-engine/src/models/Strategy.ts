import { Schema, model } from 'mongoose';
import { Strategy, StrategyType, StrategyStatus } from '../types';

const StrategySchema = new Schema<Strategy>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true, enum: Object.values(StrategyType) },
  status: { type: String, required: true, enum: Object.values(StrategyStatus) },
  parameters: {
    symbol: { type: String, required: true },
    timeframe: { type: String, required: true },
    entryRules: [{ type: Schema.Types.Mixed }],
    exitRules: [{ type: Schema.Types.Mixed }],
    riskManagement: {
      stopLoss: { type: Number, required: true },
      takeProfit: { type: Number, required: true },
      maxDrawdown: { type: Number, required: true }
    },
    positionSize: {
      type: { type: String, required: true, enum: ['fixed', 'percentage'] },
      value: { type: Number, required: true }
    }
  },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true }
});

export default model<Strategy>('Strategy', StrategySchema); 