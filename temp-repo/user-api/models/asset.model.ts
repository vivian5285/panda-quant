import mongoose from 'mongoose';

export interface IAsset {
  userId: mongoose.Types.ObjectId;
  balance: number;
  totalProfit: number;
  isNewUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPayment {
  userId: mongoose.Types.ObjectId;
  type: 'DEPOSIT' | 'FEE';
  chain?: string;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  txHash?: string;
  deductionSource?: 'deductionCredit' | 'balance' | 'none';
  deductionAmount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IChainAddress {
  chain: string;
  address: string;
  minAmount: number;
  fee: number;
  isActive: boolean;
}

const assetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  isNewUser: {
    type: Boolean,
    default: true
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

const paymentSchema = new mongoose.Schema({
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
  chain: {
    type: String,
    enum: ['BSC', 'TRC20', 'ARB', 'OP', 'SOL']
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'COMPLETED', 'FAILED'],
    default: 'PENDING'
  },
  txHash: String,
  deductionSource: {
    type: String,
    enum: ['deductionCredit', 'balance', 'none']
  },
  deductionAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const chainAddressSchema = new mongoose.Schema({
  chain: {
    type: String,
    enum: ['BSC', 'TRC20', 'ARB', 'OP', 'SOL'],
    required: true,
    unique: true
  },
  address: {
    type: String,
    required: true
  },
  minAmount: {
    type: Number,
    required: true
  },
  fee: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export const Asset = mongoose.model('Asset', assetSchema);
export const Payment = mongoose.model('Payment', paymentSchema);
export const ChainAddress = mongoose.model('ChainAddress', chainAddressSchema); 