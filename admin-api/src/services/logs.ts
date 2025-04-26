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

const prisma = new PrismaClient();

export const logService = {
    async createLog(level: LogLevel, source: LogSource, message: string, data?: any) {
        try {
            await prisma.log.create({
                data: {
                    level,
                    source,
                    message,
                    data: data ? JSON.stringify(data) : null,
                    timestamp: new Date()
                }
            });
        } catch (error) {
            console.error('Failed to create log:', error);
        }
    },

    async getLogs(level?: LogLevel, source?: LogSource, startDate?: Date, endDate?: Date) {
        const where: any = {};
        
        if (level) where.level = level;
        if (source) where.source = source;
        if (startDate || endDate) {
            where.timestamp = {};
            if (startDate) where.timestamp.gte = startDate;
            if (endDate) where.timestamp.lte = endDate;
        }

        return await prisma.log.findMany({
            where,
            orderBy: { timestamp: 'desc' }
        });
    },

    async getLogStats() {
        const [total, byLevel, bySource] = await Promise.all([
            prisma.log.count(),
            prisma.log.groupBy({
                by: ['level'],
                _count: true
            }),
            prisma.log.groupBy({
                by: ['source'],
                _count: true
            })
        ]);

        return {
            total,
            byLevel: byLevel.reduce((acc: Record<string, number>, curr: { level: string; _count: number }) => {
                acc[curr.level] = curr._count;
                return acc;
            }, {}),
            bySource: bySource.reduce((acc: Record<string, number>, curr: { source: string; _count: number }) => {
                acc[curr.source] = curr._count;
                return acc;
            }, {})
        };
    }
}; 