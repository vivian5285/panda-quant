export interface PerformanceData {
  date: string;
  value: number;
  dailyReturn?: number;
  monthlyReturn?: number;
  annualizedReturn?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
  change?: number;
  volume?: number;
  trades?: number;
} 