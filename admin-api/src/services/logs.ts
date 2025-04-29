import { PrismaClient } from '@prisma/client';

export enum LogLevel {
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

export enum LogSource {
    API = 'API',
    STRATEGY = 'STRATEGY',
    SYSTEM = 'SYSTEM'
}

export interface LogEntry {
    level: LogLevel;
    source: LogSource;
    message: string;
    data?: any;
    timestamp: Date;
}

export class LogService {
    private prisma: PrismaClient;

    constructor() {
        this.prisma = new PrismaClient();
    }

    async createLog(level: LogLevel, source: LogSource, message: string, data?: any) {
        return this.prisma.log.create({
            data: {
                level,
                source,
                message,
                data: data ? JSON.stringify(data) : null,
                timestamp: new Date()
            }
        });
    }

    async getLogs(level?: LogLevel, source?: LogSource, startDate?: Date, endDate?: Date) {
        const where: any = {};
        
        if (level) where.level = level;
        if (source) where.source = source;
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp.gte = startDate;
            if (endDate) where.timestamp.lte = endDate;
        }

        return this.prisma.log.findMany({
            where,
            orderBy: {
                timestamp: 'desc'
            }
        });
    }

    async getLogStats() {
        const stats = await this.prisma.log.groupBy({
            by: ['level', 'source'],
            _count: true
        });

        return stats;
    }
} 