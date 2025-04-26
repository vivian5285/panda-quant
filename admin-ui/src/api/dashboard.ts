import axios from 'axios';
import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface DashboardData {
  totalBalance: number;
  totalProfit: number;
  totalUsers: number;
  activeUsers: number;
  profitTrend: Array<{ date: string; profit: number }>;
  userActivity: Array<{ date: string; activeUsers: number }>;
  highRiskStrategies: Array<{
    id: string;
    name: string;
    riskLevel: string;
    warning: string;
  }>;
}

let socket: Socket | null = null;

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await axios.get(`${API_URL}/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const subscribeToDashboardUpdates = (callback: (data: Partial<DashboardData>) => void) => {
  if (!socket) {
    socket = io('/dashboard', {
      path: '/socket.io',
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to dashboard WebSocket');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from dashboard WebSocket');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  socket.on('dashboardUpdate', (data: Partial<DashboardData>) => {
    callback(data);
  });

  return () => {
    if (socket) {
      socket.off('dashboardUpdate');
    }
  };
};

export const unsubscribeFromDashboardUpdates = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 