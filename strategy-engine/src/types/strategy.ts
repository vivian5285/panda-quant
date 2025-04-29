export interface Strategy {
  id: string;
  userId: string;
  name: string;
  description: string;
  riskLevel: 'high' | 'medium' | 'low';
  active: boolean;
  parameters: Record<string, any>;
} 