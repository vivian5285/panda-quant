interface ILog {
    level: string;
    message: string;
    source: string;
    details?: any;
    createdAt: Date;
}
export declare class LogService {
    createLog(level: string, message: string, source: string, details?: any): Promise<ILog>;
}
export declare const logService: LogService;
export {};
