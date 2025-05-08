import { Schema, model, Document, models } from 'mongoose';

export interface ITransaction extends Document {
  _id: string;
  userId: string;
  type: string;
  amount: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  userId: { type: String, required: true },
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true, default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// 使用单例模式，确保模型只被定义一次
let TransactionModel: any;

try {
  // 尝试获取已存在的模型
  TransactionModel = models.Transaction;
} catch {
  // 如果模型不存在，则创建新模型
  TransactionModel = model<ITransaction>('Transaction', transactionSchema);
}

export const Transaction = TransactionModel; 