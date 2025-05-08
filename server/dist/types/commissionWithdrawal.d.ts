import { Document } from 'mongoose';
export interface ICommissionWithdrawal extends Document {
    userId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    paymentMethod: string;
    paymentDetails: Map<string, any>;
    description?: string;
    metadata?: Map<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}
//# sourceMappingURL=CommissionWithdrawal.d.ts.map