import express from 'express';
import { config } from '../config';

export const app = express();

export async function startServer(): Promise<void> {
  app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
  });
}

export async function stopServer(): Promise<void> {
  // TODO: Implement graceful shutdown
  process.exit(0);
}

export async function checkServerHealth(): Promise<boolean> {
  try {
    // TODO: Implement actual server health check
    return true;
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
} 