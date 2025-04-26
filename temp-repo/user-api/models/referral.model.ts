import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  referredId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  commission: { 
    type: Number, 
    required: true,
    min: 0
  },
  level: { 
    type: String, 
    enum: ['一代', '二代'], 
    required: true 
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  completedAt: {
    type: Date
  },
  cancelledAt: {
    type: Date
  },
  notes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// 添加索引以提高查询性能
referralSchema.index({ referrerId: 1, createdAt: -1 });
referralSchema.index({ referredId: 1 });
referralSchema.index({ status: 1 });
referralSchema.index({ transactionId: 1 });

// 在状态更新时自动设置相应的时间戳
referralSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    if (this.status === 'completed') {
      this.completedAt = new Date();
    } else if (this.status === 'cancelled') {
      this.cancelledAt = new Date();
    }
  }
  next();
});

// 添加虚拟字段
referralSchema.virtual('isActive').get(function() {
  return this.status === 'completed';
});

// 添加方法
referralSchema.methods.calculateCommission = function() {
  return this.level === '一代' ? 20 : 10;
};

const Referral = mongoose.model('Referral', referralSchema);

export default Referral; 