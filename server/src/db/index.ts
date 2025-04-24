import mongoose from 'mongoose';
import config from './config';

const environment = process.env.NODE_ENV || 'development';
const { mongoUri } = config[environment];

mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

export { mongoose }; 