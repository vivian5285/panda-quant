export interface Deposit {
  userId: string;
  amount: number;
  currency: string;
  network: string;
  txHash: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
}

export interface DepositNotification {
  userId: string;
  type: string;
  message: string;
  data: any;
}

export interface LargeDepositAlert {
  type: 'large_deposit';
  message: string;
  data: Deposit;
} 