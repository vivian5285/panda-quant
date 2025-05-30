const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/user.model.js');

async function initAdmin() {
  try {
    // 连接数据库
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/panda-quant?authSource=admin';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // 检查是否已存在管理员
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // 创建管理员用户
    const hashedPassword = await bcrypt.hash('Wl528586*', 10);
    const admin = new User({
      email: 'wangjiali240@gmail.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active'
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

initAdmin(); 