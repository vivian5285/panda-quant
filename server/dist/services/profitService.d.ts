import { Types } from 'mongoose';
export declare class ProfitService {
    private static instance;
    private constructor();
    static getInstance(): ProfitService;
    getProfitById(_id: string): Promise<any>;
    createProfit(_data: any): Promise<any>;
    updateProfit(_id: Types.ObjectId, _data: any): Promise<any>;
    deleteProfit(_id: Types.ObjectId): Promise<boolean>;
    getProfitSummary(): Promise<{
        totalProfit: number;
        totalCount: number;
        averageProfit: number;
    }>;
}
//# sourceMappingURL=ProfitService.d.ts.map