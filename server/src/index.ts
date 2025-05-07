import express, { Application } from 'express';
import app from './app';
import { logger } from './utils/logger';
import { connectDB } from './db';

const port = process.env.PORT || 3005;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer(); 