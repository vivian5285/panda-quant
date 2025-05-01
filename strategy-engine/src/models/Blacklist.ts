import mongoose from 'mongoose';

const blacklistSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  reason: {
    type: String,
    required: true
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

export const Blacklist = mongoose.model('Blacklist', blacklistSchema); 