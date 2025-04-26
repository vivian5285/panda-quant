import { logService } from '../services/logService';

export const createLog = async (level: string, message: string, source: string, details?: any) => {
  try {
    await logService.createLog(level, message, source, details);
  } catch (error) {
    console.error('Failed to create log:', error);
  }
}; 