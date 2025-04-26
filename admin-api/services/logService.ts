import { Schema, model } from 'mongoose';

interface ILog {
  level: string;
  message: string;
  source: string;
  details?: any;
  createdAt: Date;
}

const logSchema = new Schema<ILog>({
  level: { type: String, required: true },
  message: { type: String, required: true },
  source: { type: String, required: true },
  details: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

const Log = model<ILog>('Log', logSchema);

export class LogService {
  async createLog(level: string, message: string, source: string, details?: any): Promise<ILog> {
    const log = new Log({
      level,
      message,
      source,
      details
    });
    return await log.save();
  }
}

export const logService = new LogService(); 