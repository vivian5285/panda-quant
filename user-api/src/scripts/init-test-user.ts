import { UserModel } from '../models/User';
import { hashPassword } from '../utils/password';
import { connectDB } from '../config/database';
import mongoose from 'mongoose';

const initTestUser = async () => {
  try {
    // 先连接数据库
    await connectDB();
    
    // 删除现有的集合
    try {
      await mongoose.connection.collection('users').drop();
      console.log('Existing users collection dropped');
    } catch (error) {
      // 如果集合不存在，忽略错误
      console.log('No existing users collection to drop');
    }
    
    const userModel = new UserModel();
    const hashedPassword = await hashPassword('PandaQuant123!');
    
    await userModel.createUser({
      email: 'test@pandaquant.com',
      password: hashedPassword,
      name: 'Test User',
      isVerified: true
    });

    console.log('Test user created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

initTestUser(); 