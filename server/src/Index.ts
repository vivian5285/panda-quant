import express, { Application } from 'express';
import app from './App';
import { logger } from './utils/Logger';
import { connectDB } from './Db';

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