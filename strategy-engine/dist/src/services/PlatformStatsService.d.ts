export interface DailyStats {
    date: string;
    totalPlatformFee: number;
    totalTeamCommission: number;
    totalWithdrawals: number;
    activeUsers: number;
    totalTrades: number;
    totalProfit: number;
}
export declare class PlatformStatsService {
    private static instance;
    private commissionService;
    private dailyStats;
    private constructor();
    static getInstance(): PlatformStatsService;
    calculateDailyStats(date?: Date): Promise<DailyStats>;
    getDailyStats(date: string): DailyStats | undefined;
    getStatsRange(startDate: string, endDate: string): DailyStats[];
    getPlatformTotalStats(): {
        totalPlatformFee: number;
        totalTeamCommission: number;
        totalWithdrawals: number;
        totalUsers: number;
        totalTrades: number;
    };
    private formatDate;
}
