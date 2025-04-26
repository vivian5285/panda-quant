type ServiceProfitTarget = {
  id: string;
  target: number;
  current: number;
  deadline: string;
  progress: number;
  status: 'active' | 'completed' | 'failed';
}; 