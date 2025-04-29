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