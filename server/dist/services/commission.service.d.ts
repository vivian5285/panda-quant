import { Types } from 'mongoose';
import { ICommissionPerformance, ICommission } from '../types/commission';
export declare class CommissionService {
    createCommission(performance: ICommissionPerformance): Promise<ICommission>;
    getCommissions(userId: Types.ObjectId): Promise<ICommission[]>;
    getCommission(id: Types.ObjectId): Promise<ICommission | null>;
    updateCommission(id: Types.ObjectId, data: Partial<ICommission>): Promise<ICommission | null>;
    deleteCommission(id: Types.ObjectId): Promise<boolean>;
    calculateCommission(userId: Types.ObjectId, profit: number): Promise<ICommission>;
}
