export interface ICommissionWithdrawal {
    id: string;
    userId: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=CommissionWithdrawal.d.ts.map