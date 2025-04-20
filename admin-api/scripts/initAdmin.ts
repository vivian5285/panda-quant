import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/user.model';

dotenv.config();

async function initAdmin(): Promise<void> {
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/panda-quant?authSource=admin';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
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