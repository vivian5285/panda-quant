import React, { createContext, useContext, useState, useEffect } from 'react';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalChains: number;
}

interface DashboardContextType {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<DashboardData>({
    totalUsers: 0,
    activeUsers: 0,
    totalChains: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      // TODO: Replace with actual API call
      const response = await fetch('/api/dashboard');
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardContext.Provider value={{ data, loading, error, refresh: fetchData }}>
      {children}
    </DashboardContext.Provider>
  );
}; 