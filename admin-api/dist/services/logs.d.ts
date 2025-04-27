export declare enum LogLevel {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR"
}
export declare enum LogSource {
    API = "API",
    STRATEGY = "STRATEGY",
    SYSTEM = "SYSTEM"
}
export interface LogEntry {
    level: LogLevel;
    source: LogSource;
    message: string;
    data?: any;
    timestamp: Date;
}
export declare class LogService {
    private prisma;
    constructor();
    createLog(level: LogLevel, source: LogSource, message: string, data?: any): Promise<{
        data: string | null;
        id: string;
        level: string;
        source: string;
        message: string;
        timestamp: Date;
    }>;
    getLogs(level?: LogLevel, source?: LogSource, startDate?: Date, endDate?: Date): Promise<{
        data: string | null;
        id: string;
        level: string;
        source: string;
        message: string;
        timestamp: Date;
    }[]>;
    getLogStats(): Promise<(import(".prisma/client").Prisma.PickEnumerable<import(".prisma/client").Prisma.LogGroupByOutputType, ("level" | "source")[]> & {
        _count: number;
    })[]>;
}
