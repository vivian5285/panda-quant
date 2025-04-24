import { PrismaClient } from '@prisma/client';
import { LogLevel, LogSource } from '@prisma/client';

const prisma = new PrismaClient();

export class LogService {
  async getLogs(params: {
    page: number;
    pageSize: number;
    search?: string;
    level?: LogLevel;
    source?: LogSource;
  }) {
    const { page, pageSize, search, level, source } = params;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(search && {
        OR: [
          { message: { contains: search } },
          { details: { contains: search } }
        ]
      }),
      ...(level && { level }),
      ...(source && { source })
    };

    const [logs, total] = await Promise.all([
      prisma.log.findMany({
        where,
        orderBy: { timestamp: 'desc' },
        skip,
        take: pageSize
      }),
      prisma.log.count({ where })
    ]);

    const stats = await prisma.log.groupBy({
      by: ['level'],
      _count: true,
      where: {
        timestamp: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // 24小时内
        }
      }
    });

    return {
      logs,
      totalPages: Math.ceil(total / pageSize),
      stats: {
        total,
        info: stats.find(s => s.level === 'INFO')?._count || 0,
        warning: stats.find(s => s.level === 'WARNING')?._count || 0,
        error: stats.find(s => s.level === 'ERROR')?._count || 0
      }
    };
  }

  async createLog(data: {
    level: LogLevel;
    message: string;
    source: LogSource;
    details?: string;
  }) {
    return prisma.log.create({
      data: {
        ...data,
        timestamp: new Date()
      }
    });
  }
} 