export type SettlementStatus = 'pending' | 'completed' | 'failed';

export interface Settlement {
  id: string;
  userId: string;
  amount: number;
  commissionIds: string[];
  createdAt: Date;
  status: SettlementStatus;
  platformShare: number;
  level1Share: number;
  level2Share: number;
}

export interface SettlementFilter {
  startDate?: Date;
  endDate?: Date;
  userId?: string;
  status?: SettlementStatus | 'all';
}

export interface SettlementSummary {
  totalAmount: number;
  totalCount: number;
  pendingCount: number;
  completedCount: number;
  failedCount: number;
  platformTotal: number;
  level1Total: number;
  level2Total: number;
}

export interface SettlementResponse {
  settlements: Settlement[];
  summary: SettlementSummary;
} 