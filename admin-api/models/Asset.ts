import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  chain: {
    type: String,
    enum: ['BSC', 'ARB', 'TRC', 'OP', 'SOL'],
    required: true
  },
  address: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    default: 0
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

assetSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export const Asset = mongoose.model('Asset', assetSchema); 