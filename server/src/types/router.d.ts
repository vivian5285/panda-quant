import { Router as ExpressRouter } from 'express';

declare global {
  namespace Express {
    interface Router extends ExpressRouter {}
  }
}

export {}; 