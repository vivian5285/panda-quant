import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['DEPOSIT', 'FEE'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  chain: {
    type: String,
    enum: ['BSC', 'ARB', 'TRC', 'OP', 'SOL'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  txHash: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

transactionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Transaction = mongoose.model('Transaction', transactionSchema); 