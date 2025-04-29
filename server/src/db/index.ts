import mongoose from 'mongoose';
import { config } from '../config';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || config.mongoUri;
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB; 