import { Types } from 'mongoose';
export declare class ProfitService {
    private static instance;
    private constructor();
    static getInstance(): ProfitService;
    getProfitById(_id: string): Promise<null>;
    createProfit(_data: any): Promise<null>;
    updateProfit(_id: Types.ObjectId, _data: any): Promise<null>;
    deleteProfit(_id: Types.ObjectId): Promise<boolean>;
    getProfitSummary(): Promise<{
        totalProfit: number;
        totalCount: number;
        averageProfit: number;
    }>;
}
//# sourceMappingURL=ProfitService.d.ts.map