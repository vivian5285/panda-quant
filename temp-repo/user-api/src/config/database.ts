import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST = 'localhost',
  DB_PORT = '27017',
  DB_USER = 'admin',
  DB_PASSWORD = 'admin123',
  DB_NAME = 'panda_quant'
} = process.env;

const uri = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
const client = new MongoClient(uri);

export const db = client.db(DB_NAME);

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}; 