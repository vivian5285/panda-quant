const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// 定义用户模型
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true
  },
  balance: {
    type: Number,
    default: 0
  },
  hostingFee: {
    type: Number,
    default: 0
  },
  subscriptionFee: {
    type: Number,
    default: 0
  },
  accountBalance: {
    type: Number,
    default: 0
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'inactive'
  },
  referralCode: {
    type: String,
    unique: true
  },
  referralRewards: {
    type: Number,
    default: 0
  },
  referredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  inviteCode: {
    type: String,
    unique: true,
    sparse: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

async function createTestUser() {
  try {
    // 连接数据库
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant');
    console.log('Connected to MongoDB');

    // 检查测试用户是否已存在
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      process.exit(0);
    }

    // 创建测试用户
    const hashedPassword = await bcrypt.hash('test123', 10);
    const testUser = new User({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      username: 'testuser',
      status: 'active',
      role: 'user',
      inviteCode: 'TEST123',
      balance: 1000,
      accountBalance: 1000
    });

    await testUser.save();
    console.log('Test user created successfully');
  } catch (error) {
    console.error('Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

createTestUser(); 