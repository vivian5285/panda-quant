export declare enum SettlementStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare enum SettlementType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    REFUND = "REFUND",
    FEE = "FEE"
}
export interface Settlement {
    _id: string;
    userId: string;
    amount: number;
    type: SettlementType;
    status: SettlementStatus;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=Settlement.types.d.ts.map