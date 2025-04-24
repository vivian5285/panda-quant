import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../hooks/useWeb3';
import AssetOverview from '../components/dashboard/AssetOverview';
import { AssetData } from '../services/dashboardService';
import { StyledCard } from '../components/common/StyledCard';
import { GradientTitle } from '../components/common/GradientTitle';
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
import dashboardService, { 
  TimeRange, 
  StrategyData, 
  ApiStatus, 
  ChartData, 
  ProfitTarget as ServiceProfitTarget,
  DashboardData
} from '../services/dashboardService';
import { PandaAlert } from '../components/common/PandaAlert';
import { PandaProgress } from '../components/common/PandaProgress';
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
  amount: number;
  valueInUSD: number;
  change24h: number;
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
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated, user: authUser } = useAuth();
  const { account } = useWeb3();
  const [currentTab, setCurrentTab] = useState(0);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end: new Date().toISOString(),
    interval: '1d'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(30000); // 30 seconds
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  
  // Dashboard data states
  const [assetData, setAssetData] = useState<AssetData | null>(null);
  const [strategyData, setStrategyData] = useState<StrategyData[]>([]);
  const [apiStatus, setApiStatus] = useState<ApiStatus[]>([]);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [profitTargets, setProfitTargets] = useState<ServiceProfitTarget[]>([]);
  const [showAddTargetDialog, setShowAddTargetDialog] = useState(false);
  const [strategyStatus, setStrategyStatus] = useState<StrategyStatus[]>([]);

  // 图表和时间范围控制
  const [chartType, setChartType] = useState<ChartType>('line');
  const [timeInterval, setTimeInterval] = useState<TimeInterval>('1m');
  const [activeTab, setActiveTab] = useState(0);

  const [selectedCurrency, setSelectedCurrency] = useState<string>('USD');
  const [currencies, setCurrencies] = useState<Record<string, CurrencyData>>({});
  const [newProfitTarget, setNewProfitTarget] = useState<NewProfitTarget>({
    currency: 'USD',
    targetAmount: 0,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const [riskMetrics, setRiskMetrics] = useState({
    sharpeRatio: 0,
    sortinoRatio: 0,
    volatility: 0,
    beta: 0
  });

  const [assetDistribution, setAssetDistribution] = useState<{
    total: number;
    byCurrency: Record<string, number>;
    byStrategy: Record<string, number>;
  }>({
    total: 0,
    byCurrency: {},
    byStrategy: {}
  });

  const [monthlyReturn] = useState(2.5);
  const [annualReturn] = useState(30);
  const [targetReturn] = useState(40);

  const totalAssets = useMemo(() => 
    apiStatus.reduce((sum, api) => sum + api.balance, 0),
    [apiStatus]
  );

  const [strategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'Trend Following',
      type: 'trend',
      status: 'active',
      performance: {
        monthlyReturn: 2.1,
        winRate: 65,
        maxDrawdown: 15.2,
        totalReturn: 24,
        annualizedReturn: 24,
      },
      targetReturn: {
        monthly: 2,
        annual: 24,
      },
    },
    {
      id: '2',
      name: 'Mean Reversion',
      type: 'meanReversion',
      status: 'paused',
      performance: {
        monthlyReturn: 1.2,
        winRate: 75,
        maxDrawdown: 8.5,
        totalReturn: 12,
        annualizedReturn: 12,
      },
      targetReturn: {
        monthly: 1,
        annual: 12,
      },
    },
  ]);

  const [assetTrend] = useState([
    { date: '2024-01', value: 900000 },
    { date: '2024-02', value: 950000 },
    { date: '2024-03', value: 1000000 },
  ]);

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
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  const [assets, setAssets] = useState<AssetData>({
    total: 0,
    change24h: 0,
    currencies: {}
  });

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
      const data = await dashboardService.getChartData({
        start: getStartDate(interval),
        end: new Date().toISOString(),
        interval: interval,
      });
      setChartData(data);
      
      // Convert ChartData to PerformanceData
      const performanceData = data.labels.map((date, index) => ({
        date,
        value: data.datasets[0].data[index],
        change: index > 0 ? data.datasets[0].data[index] - data.datasets[0].data[index - 1] : 0,
      }));
      setPerformanceData(performanceData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();
      setDashboardData(data);
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
      setProfitTargets(targets);
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
      setLoading(true);
      const response = await dashboardService.getAssetDistribution();
      setAssetDistribution(response);
      setLoading(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch asset distribution');
      setLoading(false);
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
      // Mock data for now - replace with actual API call
      const mockAssets: AssetData = {
        total: 75000,
        change24h: 1.3,
        currencies: {
          'BTC': { amount: 1.5, valueInUSD: 45000, change24h: 2.5 },
          'ETH': { amount: 10, valueInUSD: 25000, change24h: -1.2 },
          'USDT': { amount: 5000, valueInUSD: 5000, change24h: 0 }
        }
      };
      setAssets(mockAssets);
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
    setTimeRange(prev => ({
      ...prev,
      interval: value
    }));
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
      if (!newProfitTarget.currency || !newProfitTarget.targetAmount || !newProfitTarget.deadline) {
        setError(t('dashboard.errors.invalidTarget'));
        return;
      }

      const target: Omit<ServiceProfitTarget, 'id'> = {
        target: newProfitTarget.targetAmount,
        current: currencies[newProfitTarget.currency]?.amount || 0,
        deadline: newProfitTarget.deadline,
        progress: 0,
        status: 'active'
      };

      await dashboardService.createProfitTarget(target);
      await fetchProfitTargets();
      setShowAddTargetDialog(false);
      setNewProfitTarget({
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
        <div className="custom-tooltip">
          <p className="label">{`${label}`}</p>
          <p className="value">{`$${payload[0].value.toLocaleString()}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    return (
      <AreaChart data={assetTrend}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#8884d8"
          fill="#8884d8"
          fillOpacity={0.3}
        />
      </AreaChart>
    );
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

  const renderProfitTargetCard = (target: ServiceProfitTarget) => (
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
    const { byCurrency, byStrategy } = assetDistribution;
    const currencyData = Object.entries(byCurrency).map(([currency, amount]) => ({
      currency,
      amount,
      percentage: (amount / assetDistribution.total) * 100
    }));
    const strategyData = Object.entries(byStrategy).map(([strategy, amount]) => ({
      strategy,
      amount,
      percentage: (amount / assetDistribution.total) * 100
    }));

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
                  labels: strategyData.map(item => item.strategy),
                  datasets: [{
                    data: strategyData.map(item => item.amount),
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
                  strategy: item.strategy,
                  amount: `$${item.amount.toFixed(2)}`,
                  percentage: `${item.percentage.toFixed(2)}%`
                }))}
                loading={loading}
              />
            </Box>
          </PandaCard>
        </Grid>
      </Grid>
    );
  };

  const getApiStatusColor = (status: ApiStatus['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'error':
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
  const renderVisualizationSection = () => (
    <Grid container spacing={3} sx={{ mt: 2 }}>
      <Grid item xs={12} md={4}>
        <PandaCard title="策略收益分布">
          <StrategyReturnDistribution 
            data={returnDistributionData}
            title="策略收益分布"
          />
        </PandaCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <PandaCard title="风险指标">
          <RiskMetricsRadar 
            data={riskMetricsData}
            title="风险指标雷达图"
          />
        </PandaCard>
      </Grid>
      <Grid item xs={12} md={4}>
        <PandaCard title="交易频率">
          <TradeFrequencyHeatmap 
            data={tradeFrequencyData}
            title="交易频率热力图"
          />
        </PandaCard>
      </Grid>
    </Grid>
  );

  useEffect(() => {
    // 生成更多的性能数据点
    const generatePerformanceData = () => {
      const data: PerformanceData[] = [];
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-03-31');
      let currentValue = 1000000; // 初始资产 100 万
      let previousValue = currentValue;

      for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
        // 生成每日波动
        const dailyChange = (Math.random() * 2 - 1) * 0.02; // -2% 到 2% 之间的随机波动
        currentValue = currentValue * (1 + dailyChange);

        // 计算各项指标
        const dailyReturn = (currentValue - previousValue) / previousValue * 100;
        const monthlyReturn = calculateMonthlyReturn(data, currentValue);
        const annualizedReturn = calculateAnnualizedReturn(data, currentValue, startDate, date);
        const sharpeRatio = calculateSharpeRatio(data);
        const maxDrawdown = calculateMaxDrawdown(data, currentValue);

        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.round(currentValue),
          dailyReturn: parseFloat(dailyReturn.toFixed(2)),
          monthlyReturn: parseFloat(monthlyReturn.toFixed(2)),
          annualizedReturn: parseFloat(annualizedReturn.toFixed(2)),
          sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
          maxDrawdown: parseFloat(maxDrawdown.toFixed(2))
        });

        previousValue = currentValue;
      }

      return data;
    };

    // 计算月度收益率
    const calculateMonthlyReturn = (data: PerformanceData[], currentValue: number) => {
      if (data.length < 30) return 0;
      const monthAgoValue = data[data.length - 30].value;
      return (currentValue - monthAgoValue) / monthAgoValue * 100;
    };

    // 计算年化收益率
    const calculateAnnualizedReturn = (data: PerformanceData[], currentValue: number, startDate: Date, currentDate: Date) => {
      const daysPassed = Math.max(1, (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const totalReturn = (currentValue - 1000000) / 1000000;
      return (Math.pow(1 + totalReturn, 365 / daysPassed) - 1) * 100;
    };

    // 计算夏普比率
    const calculateSharpeRatio = (data: PerformanceData[]) => {
      if (data.length < 2) return 0;
      const returns = data.slice(-30).map(d => d.dailyReturn || 0);
      const avgReturn = returns.reduce((a, b) => a + b, 0) / returns.length;
      const stdDev = Math.sqrt(
        returns.reduce((a, b) => a + Math.pow(b - avgReturn, 2), 0) / (returns.length - 1)
      );
      const riskFreeRate = 2; // 假设无风险利率为 2%
      return stdDev === 0 ? 0 : (avgReturn - riskFreeRate) / stdDev;
    };

    // 计算最大回撤
    const calculateMaxDrawdown = (data: PerformanceData[], currentValue: number) => {
      if (data.length === 0) return 0;
      let maxValue = Math.max(currentValue, ...data.map(d => d.value));
      return (currentValue - maxValue) / maxValue * 100;
    };

    setPerformanceData(generatePerformanceData());
  }, []);

  const performanceData = {
    value: 100000,
    dailyReturn: 5.2,
    monthlyReturn: 150, // 月化收益
    annualizedReturn: 1800, // 年化收益
    sharpeRatio: 2.5,
    maxDrawdown: 15.2,
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientTitle>
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
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Dashboard; 