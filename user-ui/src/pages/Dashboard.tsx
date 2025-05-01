import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../hooks/useWeb3';
import AssetOverview from '../components/dashboard/AssetOverview';
import { 
  AssetData as DashboardAssetData, 
  TimeRange as DashboardTimeRange, 
  StrategyData as DashboardStrategyData, 
  ApiStatus as DashboardApiStatus, 
  ChartData as DashboardChartData, 
  ProfitTarget as DashboardProfitTarget, 
  DashboardData as DashboardServiceData,
  AssetDistribution 
} from '../services/dashboardService';
import { StyledCard } from '../components/common/StyledCard';
import { GradientTitle } from '../components/common/GradientTitle';
import Layout from '../components/Layout';
import { 
  Box, 
  Typography, 
  Grid, 
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  useTheme,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useMediaQuery,
  Tabs,
  Tab,
  Paper,
  FormControlLabel,
  Switch,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  LinearProgress,
  Button,
  SelectChangeEvent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CardHeader,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  Api as ApiIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  Delete as DeleteIcon,
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  Error as ErrorIcon,
  PlayCircle as PlayCircleIcon,
  PauseCircle as PauseCircleIcon,
  StopCircle as StopCircleIcon,
  Info as InfoIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import dashboardService from '../services/dashboardService';
import PandaAlert from '../components/common/PandaAlert';
import PandaProgress from '../components/common/PandaProgress';
import PandaButton from '../components/common/PandaButton';
import PandaCard from '../components/common/PandaCard';
import PandaTable from '../components/common/PandaTable';
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip as RechartsTooltip,
  Line as RechartsLine,
} from 'recharts';
import { StrategyReturnDistribution, RiskMetricsRadar, TradeFrequencyHeatmap } from '../components/charts';
import StrategyOverview from '../components/dashboard/StrategyOverview';
import { fadeIn, slideUp, staggerChildren } from '../animations';
import { PerformanceChart } from '../components/charts/PerformanceChart';
import { AssetDistributionChart } from '../components/charts/AssetDistributionChart';
import type { PerformanceData } from '../types/chart';

// 注册 Chart.js 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

type ChartType = 'line' | 'bar' | 'pie';
type TimeInterval = '1d' | '1w' | '1m' | '3m' | '1y';

interface CurrencyData {
  currency: string;
  amount: number;
  percentage: number;
}

interface LocalStrategyData {
  id: string;
  name: string;
  type: string;
  status: 'paused' | 'active' | 'stopped';
  performance: {
    monthlyReturn: number;
    winRate: number;
    maxDrawdown: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
}

interface StrategyStatus {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'paused' | 'stopped';
  riskLevel: 'low' | 'medium' | 'high';
  performance: {
    totalReturn: number;
    dailyReturn: number;
    maxDrawdown: number;
    winRate: number;
  };
  lastTrade: {
    time: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  };
}

interface StrategyDistribution {
  strategy: string;
  amount: number;
  percentage: number;
}

interface NewProfitTarget {
  currency: string;
  targetAmount: number;
  deadline: string;
}

interface Strategy {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'paused' | 'stopped';
  performance: {
    monthlyReturn: number;
    winRate: number;
    maxDrawdown: number;
    totalReturn: number;
    annualizedReturn: number;
  };
  targetReturn: {
    monthly: number;
    annual: number;
  };
}

interface User {
  username: string;
  email: string;
}

interface DashboardProps {
  user?: User;
}

interface LocalAssetData {
  total: number;
  change24h: number;
  currencies: Record<string, {
    amount: number;
    valueInUSD: number;
    change24h: number;
  }>;
}

interface ProfitTarget {
  id: string;
  strategyId: string;
  target: number;
  current: number;
  status: 'active' | 'completed' | 'failed';
  deadline: string;
}

interface StrategyData {
  id: string;
  name: string;
  type: string;
  status: 'paused' | 'active' | 'stopped';
  performance: {
    monthlyReturn: number;
    winRate: number;
    maxDrawdown: number;
    totalReturn?: number;
    annualizedReturn?: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
  percentage?: number;
}

interface LocalApiStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  lastChecked: string;
  responseTime: number;
}

interface LocalDashboardData {
  assets: DashboardAssetData;
  strategies: LocalStrategyData[];
  apiStatus: DashboardApiStatus[];
  profitTargets: DashboardProfitTarget[];
  chartData: Array<{ date: string; value: number }>;
}

interface TimeRange {
  start: string;
  end: string;
  interval: TimeInterval;
}

interface ChartData {
  date: string;
  value: number;
  change?: number;
  dailyReturn?: number;
  monthlyReturn?: number;
  sharpeRatio?: number;
  maxDrawdown?: number;
}

interface ApiStatus {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'degraded';
  lastChecked: string;
  responseTime: number;
  exchange?: string;
  lastSync?: string;
  balance?: number;
}

interface DashboardData {
  assets: {
    total: number;
    change24h: number;
    currencies: Record<string, {
      amount: number;
      valueInUSD: number;
      change24h: number;
    }>;
  };
  strategies: StrategyData[];
  apiStatus: ApiStatus[];
  profitTargets: ProfitTarget[];
  chartData: Array<{ date: string; value: number }>;
}

// 添加计算函数
const calculateMonthlyReturn = (data: Array<{ value: number }>, currentValue: number): number => {
  if (data.length === 0) return 0;
  const firstValue = data[0].value;
  return ((currentValue - firstValue) / firstValue) * 100;
};

const calculateAnnualizedReturn = (
  data: Array<{ value: number }>,
  currentValue: number,
  startDate: Date,
  endDate: Date
): number => {
  if (data.length === 0) return 0;
  const firstValue = data[0].value;
  const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return (Math.pow(currentValue / firstValue, 1 / years) - 1) * 100;
};

const calculateSharpeRatio = (data: Array<{ value: number }>): number => {
  if (data.length < 2) return 0;
  const returns = data.slice(1).map((d, i) => (d.value - data[i].value) / data[i].value);
  const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
  const stdDev = Math.sqrt(returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / returns.length);
  return avgReturn / stdDev;
};

const calculateMaxDrawdown = (data: Array<{ value: number }>, currentValue: number): number => {
  if (data.length === 0) return 0;
  let peak = data[0].value;
  let maxDrawdown = 0;
  
  for (const point of data) {
    if (point.value > peak) {
      peak = point.value;
    }
    const drawdown = (peak - point.value) / peak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  }
  
  return maxDrawdown * 100;
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { connect, disconnect, isConnected, account } = useWeb3();
  const { user: authUser } = useAuth();
  const [currencies, setCurrencies] = useState<Record<string, CurrencyData>>({});
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: '',
    end: '',
    interval: '1m'
  });
  const [assetDistribution, setAssetDistribution] = useState<AssetDistribution>({
    total: 0,
    byCurrency: {},
    byStrategy: {}
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('1m');
  const [chartData, setChartData] = useState<Array<{ date: string; value: number }>>([]);
  const [strategyStatus, setStrategyStatus] = useState<StrategyStatus[]>([]);
  const [apiStatus, setApiStatus] = useState<ApiStatus[]>([]);
  const [profitTargets, setProfitTargets] = useState<ProfitTarget[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [dashboardData, setDashboardData] = useState<LocalDashboardData>({
    assets: {
      total: 0,
      change24h: 0,
      currencies: {}
    },
    strategies: [],
    apiStatus: [],
    profitTargets: [],
    chartData: []
  });
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [showAddTargetDialog, setShowAddTargetDialog] = useState(false);
  const [newTarget, setNewTarget] = useState<NewProfitTarget>({
    currency: 'USDT',
    targetAmount: 0,
    deadline: new Date().toISOString().split('T')[0]
  });

  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [riskMetrics, setRiskMetrics] = useState({
    sharpeRatio: 0,
    sortinoRatio: 0,
    volatility: 0,
    beta: 0
  });

  const [assets, setAssets] = useState<DashboardAssetData>({
    total: 0,
    change24h: 0,
    currencies: {}
  });

  const [strategies, setStrategies] = useState<LocalStrategyData[]>([]);
  const [strategyDistribution, setStrategyDistribution] = useState<StrategyDistribution[]>([]);
  const [assetTrend] = useState<Array<{ date: string; value: number }>>([]);

  // 添加新的状态用于可视化数据
  const [returnDistributionData, setReturnDistributionData] = useState({
    labels: ['-5%', '-3%', '-1%', '1%', '3%', '5%'],
    values: [10, 20, 30, 40, 30, 20]
  });

  const [riskMetricsData, setRiskMetricsData] = useState({
    labels: ['波动率', '最大回撤', '夏普比率', '胜率', '盈亏比'],
    values: [80, 60, 70, 90, 75]
  });

  const [tradeFrequencyData, setTradeFrequencyData] = useState({
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
    datasets: [{
      label: 'BTC/USDT',
      data: [[10, 20, 30, 40, 50, 60], [15, 25, 35, 45, 55, 65]]
    }]
  });

  const [totalProfit, setTotalProfit] = useState(0);
  const [activeStrategies, setActiveStrategies] = useState(0);
  const [successRate, setSuccessRate] = useState(0);
  const [recentActivities, setRecentActivities] = useState([]);

  const [assetData, setAssetData] = useState<LocalAssetData | null>(null);
  const [currencyData, setCurrencyData] = useState<CurrencyData[]>([]);
  const [strategyData, setStrategyData] = useState<StrategyData[]>([]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleChartTypeChange = (type: ChartType) => {
    setChartType(type);
  };

  const handleTimeIntervalChange = (interval: TimeInterval) => {
    setTimeInterval(interval);
    fetchChartData(interval);
  };

  const getStartDate = (interval: TimeInterval): string => {
    const now = new Date();
    switch (interval) {
      case '1d':
        return new Date(now.setDate(now.getDate() - 1)).toISOString();
      case '1w':
        return new Date(now.setDate(now.getDate() - 7)).toISOString();
      case '1m':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString();
      case '3m':
        return new Date(now.setMonth(now.getMonth() - 3)).toISOString();
      case '1y':
        return new Date(now.setFullYear(now.getFullYear() - 1)).toISOString();
      default:
        return new Date(now.setDate(now.getDate() - 1)).toISOString();
    }
  };

  const fetchChartData = async (interval: TimeInterval) => {
    try {
      const timeRange: DashboardTimeRange = {
        start: getStartDate(interval),
        end: new Date().toISOString(),
        interval
      };
      const data = await dashboardService.getChartData(timeRange);
      const formattedData = data.labels.map((date, index) => ({
        date,
        value: data.datasets[0].data[index]
      }));
      setChartData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      setDashboardData({
        assets: data.assets,
        strategies: data.strategies.map(strategy => ({
          ...strategy,
          riskLevel: strategy.riskLevel || 'medium',
          lastUpdated: new Date().toISOString()
        })),
        apiStatus: data.apiStatus,
        profitTargets: data.profitTargets,
        chartData: data.chartData
      });
      setError(null);
    } catch (error) {
      setError(t('dashboard.errors.fetchFailed'));
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchProfitTargets = useCallback(async () => {
    try {
      const targets = await dashboardService.getProfitTargets();
      const localTargets: ProfitTarget[] = targets.map(target => ({
        ...target,
        strategyId: target.strategyId || 'default'
      }));
      setProfitTargets(localTargets);
    } catch (error) {
      console.error('Error fetching profit targets:', error);
    }
  }, []);

  const fetchRiskMetrics = useCallback(async () => {
    try {
      const metrics = await dashboardService.getRiskMetrics();
      setRiskMetrics(metrics);
    } catch (error) {
      console.error('Error fetching risk metrics:', error);
    }
  }, []);

  const fetchAssetDistribution = async () => {
    try {
      const response = await fetch('/api/assets/distribution');
      if (!response.ok) {
        throw new Error('Failed to fetch asset distribution');
      }
      const data = await response.json();
      setAssetDistribution({
        total: data.total || 0,
        byCurrency: data.byCurrency || {},
        byStrategy: data.byStrategy || {}
      });
    } catch (error) {
      console.error('Error fetching asset distribution:', error);
    }
  };

  const fetchStrategyStatus = async () => {
    try {
      const response = await fetch('/api/strategies/status');
      const data = await response.json();
      setStrategyStatus(data);
    } catch (error) {
      console.error('Failed to fetch strategy status:', error);
    }
  };

  // Add fetchAssets function
  const fetchAssets = useCallback(async () => {
    try {
      const data = await dashboardService.getAssets();
      setAssetData(data);
      
      // 转换货币数据
      const currencyDataArray: CurrencyData[] = Object.entries(data.currencies).map(([currency, info]) => ({
        currency,
        amount: info.amount,
        percentage: (info.valueInUSD / data.total) * 100
      }));
      setCurrencyData(currencyDataArray);
      
      // 转换策略数据
      const strategies = await dashboardService.getStrategies();
      const strategyDataArray: StrategyData[] = strategies.map(strategy => ({
        id: strategy.id,
        name: strategy.name,
        type: strategy.type,
        status: strategy.status,
        performance: {
          monthlyReturn: strategy.performance.monthlyReturn || 0,
          winRate: strategy.performance.winRate || 0,
          maxDrawdown: strategy.performance.maxDrawdown,
          totalReturn: strategy.performance.totalReturn,
          annualizedReturn: strategy.performance.annualizedReturn
        },
        riskLevel: strategy.riskLevel || 'medium',
        lastUpdated: new Date().toISOString()
      }));
      setStrategyData(strategyDataArray);
    } catch (error) {
      console.error('Error fetching assets:', error);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      fetchProfitTargets();
      fetchRiskMetrics();
      fetchAssetDistribution();
      fetchStrategyStatus();
    }
  }, [isAuthenticated, fetchDashboardData, fetchProfitTargets, fetchRiskMetrics, fetchAssetDistribution, fetchStrategyStatus]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  // Auto refresh setup
  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return;

    const interval = setInterval(() => {
      fetchDashboardData();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isAuthenticated, fetchDashboardData]);

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    const value = event.target.value as TimeRange['interval'];
    const newTimeRange: TimeRange = {
      start: getStartDate(value),
      end: new Date().toISOString(),
      interval: value
    };
    setTimeRange(newTimeRange);
    fetchChartData(value);
  };

  const handleAutoRefreshChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoRefresh(event.target.checked);
  };

  const handleRefreshIntervalChange = (event: SelectChangeEvent) => {
    setRefreshInterval(Number(event.target.value));
  };

  const handleManualRefresh = () => {
    fetchDashboardData();
  };

  const handleStrategyAction = async (strategyId: string, action: 'start' | 'stop' | 'pause') => {
    try {
      setLoading(true);
      switch (action) {
        case 'start':
          await dashboardService.startStrategy(strategyId);
          break;
        case 'stop':
          await dashboardService.stopStrategy(strategyId);
          break;
        case 'pause':
          await dashboardService.pauseStrategy(strategyId);
          break;
      }
      await fetchDashboardData();
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to perform strategy action');
      setLoading(false);
    }
  };

  const handleCurrencyChange = (event: SelectChangeEvent) => {
    setSelectedCurrency(event.target.value);
  };

  const handleAddTarget = async () => {
    try {
      if (!newTarget.currency || !newTarget.targetAmount || !newTarget.deadline) {
        setError(t('dashboard.errors.invalidTarget'));
        return;
      }

      const target: ProfitTarget = {
        id: Date.now().toString(),
        strategyId: 'default',
        target: newTarget.targetAmount,
        current: currencies[newTarget.currency]?.amount || 0,
        status: 'active',
        deadline: newTarget.deadline
      };

      await dashboardService.createProfitTarget(target);
      await fetchProfitTargets();
      setShowAddTargetDialog(false);
      setNewTarget({
        currency: 'USD',
        targetAmount: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    } catch (error) {
      setError(t('dashboard.errors.createTargetFailed'));
      console.error('Error creating profit target:', error);
    }
  };

  const handleDeleteTarget = async (id: string) => {
    try {
      await dashboardService.deleteProfitTarget(id);
      await fetchProfitTargets();
    } catch (error) {
      setError(t('dashboard.errors.deleteTargetFailed'));
      console.error('Error deleting profit target:', error);
    }
  };

  const handleProfitTargetUpdate = (target: ProfitTarget) => {
    setProfitTargets(prev => prev.map(t => 
      t.id === target.id ? { ...t, ...target } : t
    ));
  };

  const calculateStrategyMetrics = (strategy: LocalStrategyData) => {
    return {
      monthlyReturn: strategy.performance.monthlyReturn,
      winRate: 0, // 需要从其他地方获取
      maxDrawdown: 0 // 需要从其他地方获取
    };
  };

  // 修复 user.name 错误
  const userName = authUser?.username || authUser?.email?.split('@')[0] || 'User';

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <PandaAlert severity="warning" message={t('dashboard.authRequired')} />
      </Box>
    );
  }

  if (loading && !lastUpdate) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <PandaProgress value={0} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <PandaAlert severity="error" message={error} />
      </Box>
    );
  }

  const CustomTooltip: React.FC<{
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ 
          backgroundColor: 'white',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}>
          <p className="label" style={{ margin: '0 0 5px 0' }}>{`${label}`}</p>
          <p className="value" style={{ margin: 0 }}>{`$${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const chartProps = {
    dataKey: 'value',
    stroke: '#8884d8',
    fill: '#8884d8'
  } as const;

  const renderChart = (type: ChartType, data: Array<{ date: string; value: number }>) => {
    const chartData = {
      labels: data.map(item => item.date),
      datasets: [
        {
          label: t('dashboard.chart.performance'),
          data: data.map(item => item.value),
          borderColor: theme.palette.primary.main,
          backgroundColor: theme.palette.primary.light,
          fill: false,
          tension: 0.4
        }
      ]
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
        },
        title: {
          display: true,
          text: t('dashboard.chart.performance')
        }
      }
    };

    switch (type) {
      case 'line':
        return <Line data={chartData} options={options} />;
      case 'bar':
        return <Bar data={chartData} options={options} />;
      case 'pie':
        return <Pie data={chartData} options={options} />;
      default:
        return null;
    }
  };

  const renderCurrencyCard = (currency: string, data: { amount: number; valueInUSD: number; change24h: number }) => {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {currency}
          </Typography>
          <Typography variant="h4" color="primary">
            ${data.valueInUSD.toFixed(2)}
          </Typography>
          <Typography variant="body2" color={data.change24h >= 0 ? 'success.main' : 'error.main'}>
            {data.change24h >= 0 ? '+' : ''}{data.change24h}%
          </Typography>
        </CardContent>
      </Card>
    );
  };

  const renderProfitTargetCard = (target: ProfitTarget) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <PandaCard>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {t('dashboard.profitTarget')}
            </Typography>
            <IconButton
              size="small"
              onClick={() => handleDeleteTarget(target.id)}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.target')}
            </Typography>
            <Typography variant="h6">
              {target.target}%
            </Typography>
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.currentProgress')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <LinearProgress
                  variant="determinate"
                  value={(target.current / target.target) * 100}
                  color={(target.current / target.target) * 100 >= 100 ? 'success' : 'primary'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {((target.current / target.target) * 100).toFixed(1)}%
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.current')}
            </Typography>
            <Typography variant="body2">
              {target.current}%
            </Typography>
          </Box>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.deadline')}
            </Typography>
            <Typography variant="body2">
              {new Date(target.deadline).toLocaleDateString()}
            </Typography>
          </Box>
        </CardContent>
      </PandaCard>
    </motion.div>
  );

  const renderRiskMetrics = () => (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6} md={3}>
        <PandaCard>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.sharpeRatio')}
            </Typography>
            <Typography variant="h6">
              {riskMetrics.sharpeRatio.toFixed(2)}
            </Typography>
          </CardContent>
        </PandaCard>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <PandaCard>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.sortinoRatio')}
            </Typography>
            <Typography variant="h6">
              {riskMetrics.sortinoRatio.toFixed(2)}
            </Typography>
          </CardContent>
        </PandaCard>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <PandaCard>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.volatility')}
            </Typography>
            <Typography variant="h6">
              {riskMetrics.volatility.toFixed(2)}%
            </Typography>
          </CardContent>
        </PandaCard>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <PandaCard>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              {t('dashboard.beta')}
            </Typography>
            <Typography variant="h6">
              {riskMetrics.beta.toFixed(2)}
            </Typography>
          </CardContent>
        </PandaCard>
      </Grid>
    </Grid>
  );

  const renderAssetDistribution = () => {
    if (!assetData) return null;
    
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <PandaCard title={t('dashboard.currencyDistribution')}>
            <Box sx={{ height: 300 }}>
              <Pie
                data={{
                  labels: currencyData.map(item => item.currency),
                  datasets: [{
                    data: currencyData.map(item => item.amount),
                    backgroundColor: [
                      theme.palette.primary.main,
                      theme.palette.secondary.main,
                      theme.palette.success.main,
                      theme.palette.warning.main,
                      theme.palette.error.main
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <PandaTable
                columns={[
                  { id: 'currency', label: t('dashboard.currency') },
                  { id: 'amount', label: t('dashboard.amount') },
                  { id: 'percentage', label: t('dashboard.percentage') }
                ]}
                data={currencyData.map(item => ({
                  currency: item.currency,
                  amount: `$${item.amount.toFixed(2)}`,
                  percentage: `${item.percentage.toFixed(2)}%`
                }))}
                loading={loading}
              />
            </Box>
          </PandaCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <PandaCard title={t('dashboard.strategyDistribution')}>
            <Box sx={{ height: 300 }}>
              <Pie
                data={{
                  labels: strategyData.map(item => item.name),
                  datasets: [{
                    data: strategyData.map(item => item.performance.monthlyReturn),
                    backgroundColor: [
                      theme.palette.primary.main,
                      theme.palette.secondary.main,
                      theme.palette.success.main,
                      theme.palette.warning.main,
                      theme.palette.error.main
                    ]
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right'
                    }
                  }
                }}
              />
            </Box>
            <Box sx={{ mt: 2 }}>
              <PandaTable
                columns={[
                  { id: 'strategy', label: t('dashboard.strategy') },
                  { id: 'amount', label: t('dashboard.amount') },
                  { id: 'percentage', label: t('dashboard.percentage') }
                ]}
                data={strategyData.map(item => ({
                  strategy: item.name,
                  amount: `$${item.performance.monthlyReturn.toFixed(2)}%`,
                  percentage: `${item.percentage?.toFixed(2) || ''}%`
                }))}
                loading={loading}
              />
            </Box>
          </PandaCard>
        </Grid>
      </Grid>
    );
  };

  const getApiStatusColor = (status: 'online' | 'offline' | 'degraded') => {
    switch (status) {
      case 'online':
        return 'success';
      case 'degraded':
        return 'warning';
      case 'offline':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderApiStatus = () => {
    return (
      <Card>
        <CardHeader title={t('dashboard.apiStatus')} />
        <CardContent>
          <List>
            {apiStatus.map((api) => (
              <ListItem key={api.id}>
                <ListItemText
                  primary={api.exchange}
                  secondary={`${t('dashboard.lastUpdate')}: ${new Date(api.lastSync).toLocaleString()}`}
                />
                <Chip
                  label={t(`dashboard.status.${api.status}`)}
                  color={getApiStatusColor(api.status)}
                  size="small"
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  };

  const renderProfitTargets = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('dashboard.profitTargets')}
        </Typography>
        {profitTargets.map((target) => (
          <Box key={target.id} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">
                {t('dashboard.target')}: {target.target}%
              </Typography>
              <Typography variant="body2">
                {t('dashboard.deadline')}: {new Date(target.deadline).toLocaleDateString()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(target.current / target.target) * 100}
              sx={{ height: 10, borderRadius: 5 }}
            />
            <Typography variant="caption" color="text.secondary">
              {t('dashboard.current')}: {target.current}%
            </Typography>
          </Box>
        ))}
      </CardContent>
    </Card>
  );

  const renderStrategyStatus = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {t('dashboard.strategyStatus')}
        </Typography>
        <List>
          {strategyStatus.map((strategy) => (
            <ListItem key={strategy.id}>
              <ListItemIcon>
                {strategy.status === 'running' ? (
                  <PlayCircleIcon color="success" />
                ) : strategy.status === 'paused' ? (
                  <PauseCircleIcon color="warning" />
                ) : (
                  <StopCircleIcon color="error" />
                )}
              </ListItemIcon>
              <ListItemText
                primary={strategy.name}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {t(`dashboard.strategyType.${strategy.type}`)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('dashboard.riskLevel')}: {t(`dashboard.riskLevel.${strategy.riskLevel}`)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {t('dashboard.totalReturn')}: {strategy.performance.totalReturn}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {t('dashboard.winRate')}: {strategy.performance.winRate}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {t('dashboard.maxDrawdown')}: {strategy.performance.maxDrawdown}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            {t('dashboard.lastTrade')}: {new Date(strategy.lastTrade.time).toLocaleString()}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={strategy.status === 'running' ? 100 : 0}
                        color={strategy.status === 'running' ? 'success' : 'error'}
                        sx={{ height: 4, borderRadius: 2 }}
                      />
                    </Box>
                  </>
                }
              />
              <IconButton
                edge="end"
                onClick={() => handleStrategyAction(strategy.id, 'pause')}
                disabled={strategy.status !== 'running'}
              >
                <PauseIcon />
              </IconButton>
              <IconButton
                edge="end"
                onClick={() => handleStrategyAction(strategy.id, 'stop')}
                disabled={strategy.status === 'stopped'}
              >
                <StopIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const totalChange = assetData?.change24h || 0;
  const assetDataChart = [
    { date: '2024-01', value: assetData?.total || 0 },
    { date: '2024-02', value: assetData?.total || 0 },
    { date: '2024-03', value: assetData?.total || 0 },
    { date: '2024-04', value: assetData?.total || 0 },
  ];

  const getReturnColor = (returnValue: number) => {
    if (returnValue >= 200) return 'success.main';
    if (returnValue >= 100) return 'info.main';
    if (returnValue >= 50) return 'warning.main';
    return 'error.main';
  };

  const renderStrategyTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('dashboard.strategyName')}</TableCell>
            <TableCell>{t('dashboard.status')}</TableCell>
            <TableCell>{t('dashboard.monthlyReturn')}</TableCell>
            <TableCell>{t('dashboard.winRate')}</TableCell>
            <TableCell>{t('dashboard.maxDrawdown')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {strategies.map((strategy) => (
            <TableRow key={strategy.id}>
              <TableCell>{strategy.name}</TableCell>
              <TableCell>
                <Chip
                  label={strategy.status}
                  color={
                    strategy.status === 'active'
                      ? 'success'
                      : strategy.status === 'paused'
                      ? 'warning'
                      : 'error'
                  }
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  color={getReturnColor(strategy.performance.monthlyReturn)}
                  sx={{ fontWeight: 'bold' }}
                >
                  {strategy.performance.monthlyReturn}%
                </Typography>
              </TableCell>
              <TableCell>{strategy.performance.winRate}%</TableCell>
              <TableCell>{strategy.performance.maxDrawdown}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // 添加新的渲染函数
  const renderVisualizationSection = () => {
    return (
      <Box sx={{ p: 2 }}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={generatePerformanceData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip 
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div style={{ 
                      backgroundColor: 'white',
                      padding: '10px',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}>
                      <p style={{ margin: '0 0 5px 0' }}>{`${label}`}</p>
                      <p style={{ margin: 0 }}>{`$${payload[0].value.toLocaleString()}`}</p>
                    </div>
                  );
                }
                return null;
              }}
              cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
            />
            <RechartsLine 
              dataKey="value"
              stroke={theme.palette.primary.main}
              dot={false}
              name="Value"
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    );
  };

  const generatePerformanceData = () => {
    if (!assetData) return [];
    
    return [
      { date: '2024-01', value: assetData.total * 0.8 },
      { date: '2024-02', value: assetData.total * 0.9 },
      { date: '2024-03', value: assetData.total * 1.1 },
      { date: '2024-04', value: assetData.total }
    ];
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <GradientTitle title="我的交易仪表盘" variant="h4" align="center">
              我的交易仪表盘
            </GradientTitle>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              月化收益50%-300%，我们只收取收益的10%
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="策略表现"
                  gradient
                  animation
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <PerformanceChart 
                        data={performanceData} 
                        showMetrics={['value', 'dailyReturn']}
                        title="每日收益"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <PerformanceChart 
                        data={performanceData}
                        showMetrics={['monthlyReturn']}
                        title="月化收益"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <PerformanceChart 
                        data={performanceData}
                        showMetrics={['sharpeRatio']}
                        title="夏普比率"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <PerformanceChart 
                        data={performanceData}
                        showMetrics={['maxDrawdown']}
                        title="最大回撤"
                      />
                    </Grid>
                  </Grid>
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="资产概览"
                  gradient
                  animation
                >
                  <AssetOverview assets={assets} />
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="资产分布"
                  gradient
                  animation
                >
                  <AssetDistributionChart data={assetDistribution} />
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="风险分析"
                  gradient
                  animation
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <StrategyReturnDistribution 
                        data={returnDistributionData}
                        title="策略收益分布"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <RiskMetricsRadar 
                        data={riskMetricsData}
                        title="风险指标雷达图"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TradeFrequencyHeatmap 
                        data={tradeFrequencyData}
                        title="交易频率热力图"
                      />
                    </Grid>
                  </Grid>
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="API 状态"
                  gradient
                  animation
                >
                  {renderApiStatus()}
                </PandaCard>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="策略状态"
                  gradient
                  animation
                >
                  {renderStrategyStatus()}
                </PandaCard>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Layout>
  );
};

export default Dashboard; 