import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import {
  Box,
  Typography,
  Grid,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stepper,
  Step,
  StepLabel,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Container,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Card,
  CardContent,
} from '@mui/material';
import {
  PlayArrow as PlayArrowIcon,
  Stop as StopIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Add as AddIcon,
  Pause as PauseIcon,
  Delete as DeleteIcon,
  Assessment as AssessmentIcon,
  Tune as TuneIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  Tooltip as RechartsTooltip
} from 'recharts';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaAlert from '../components/common/PandaAlert';
import PandaProgress from '../components/common/PandaProgress';
import { fadeIn, slideUp, staggerChildren } from '../animations';
import { strategyService } from '../services/strategyService';
import { Strategy as StrategyType } from '../types/strategy';
import { Strategy as ServiceStrategy } from '../services/strategyService';

// 合并两个 Strategy 类型，确保所有属性都是必需的
type Strategy = StrategyType & Required<ServiceStrategy> & {
  riskLevel: 'low' | 'medium' | 'high';
  lastUpdated: string;
  performance: {
    monthlyReturn: number;
    totalReturn: number;
    annualizedReturn: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
    volatility: number;
    profitFactor: number;
  };
  targetReturn: {
    monthly: number;
    annual: number;
  };
  parameters: Record<string, any>;
  returns: Array<{
    date: string;
    value: number;
  }>;
  trades: Array<{
    date: string;
    type: 'buy' | 'sell';
    amount: number;
    price: number;
  }>;
  backtestResults: BacktestResult[];
  optimizationResults: Array<{
    parameters: Record<string, any>;
    metrics: {
      totalReturn: number;
      monthlyReturn: number;
      annualizedReturn: number;
      sharpeRatio: number;
      maxDrawdown: number;
      winRate: number;
    };
  }>;
};

interface BacktestResult {
  id: string;
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  monthlyReturn: number;
  annualizedReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  avgTradeReturn: number;
  avgWinReturn: number;
  avgLossReturn: number;
  equityCurve: Array<{
    date: string;
    value: number;
  }>;
}

interface OptimizationResult {
  id: string;
  strategyId: string;
  parameters: Record<string, number>;
  performance: {
    totalReturn: number;
    monthlyReturn: number;
    annualizedReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
}

interface BacktestConfig {
  strategyId: string;
  startDate: string;
  endDate: string;
  initialCapital: number;
  parameters: Record<string, any>;
}

interface OptimizeConfig {
  strategyId: string;
  parameters: Record<string, any>;
  optimizationTarget: 'monthlyReturn' | 'sharpeRatio' | 'winRate';
  constraints: {
    maxDrawdown: number;
    minWinRate: number;
  };
}

type NestedStrategyKey = keyof Strategy | 'targetReturn.monthly' | 'targetReturn.annual';

const StrategyManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showBacktestResults, setShowBacktestResults] = useState(false);
  const [showOptimizationResults, setShowOptimizationResults] = useState(false);
  const [isBacktestDialogOpen, setIsBacktestDialogOpen] = useState(false);
  const [isOptimizeDialogOpen, setIsOptimizeDialogOpen] = useState(false);
  const [backtestStep, setBacktestStep] = useState(0);
  const [optimizeStep, setOptimizeStep] = useState(0);
  const [isNewStrategyDialogOpen, setIsNewStrategyDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStrategy, setEditingStrategy] = useState<Strategy | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([
    {
      id: '1',
      name: 'Trend Following',
      type: 'trend',
      status: 'active',
      riskLevel: 'medium',
      performance: {
        monthlyReturn: 85.2,
        totalReturn: 1022.4,
        annualizedReturn: 1022.4,
        winRate: 65,
        maxDrawdown: 15.2,
        sharpeRatio: 1.5,
        volatility: 0.2,
        profitFactor: 2.1
      },
      targetReturn: {
        monthly: 0,
        annual: 0,
      },
      parameters: {},
      returns: [],
      trades: [],
      backtestResults: [],
      optimizationResults: [],
      lastUpdated: '2023-01-01',
    },
    {
      id: '2',
      name: 'Mean Reversion',
      type: 'meanReversion',
      status: 'paused',
      riskLevel: 'low',
      performance: {
        monthlyReturn: 65.8,
        totalReturn: 789.6,
        annualizedReturn: 789.6,
        winRate: 70,
        maxDrawdown: 10.5,
        sharpeRatio: 1.8,
        volatility: 0.15,
        profitFactor: 2.5
      },
      targetReturn: {
        monthly: 0,
        annual: 0,
      },
      parameters: {},
      returns: [],
      trades: [],
      backtestResults: [],
      optimizationResults: [],
      lastUpdated: '2023-01-01',
    },
    {
      id: '3',
      name: 'Arbitrage',
      type: 'arbitrage',
      status: 'stopped',
      riskLevel: 'high',
      performance: {
        monthlyReturn: 120.5,
        totalReturn: 1446.0,
        annualizedReturn: 1446.0,
        winRate: 55,
        maxDrawdown: 25.5,
        sharpeRatio: 1.0,
        volatility: 0.25,
        profitFactor: 1.8
      },
      targetReturn: {
        monthly: 0,
        annual: 0,
      },
      parameters: {},
      returns: [],
      trades: [],
      backtestResults: [],
      optimizationResults: [],
      lastUpdated: '2023-01-01',
    },
  ]);
  const [newStrategy, setNewStrategy] = useState({
    name: '',
    type: '',
    riskLevel: 'medium' as const,
    targetReturn: {
      monthly: 0,
      annual: 0,
    },
  });
  const [backtestConfig, setBacktestConfig] = useState<BacktestConfig>({
    strategyId: '',
    startDate: '',
    endDate: '',
    initialCapital: 10000,
    parameters: {},
  });
  const [optimizeConfig, setOptimizeConfig] = useState<OptimizeConfig>({
    strategyId: '',
    parameters: {},
    optimizationTarget: 'monthlyReturn',
    constraints: {
      maxDrawdown: 20,
      minWinRate: 50,
    },
  });

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleBacktest = () => {
    setIsBacktestDialogOpen(true);
  };

  const handleOptimize = () => {
    setIsOptimizeDialogOpen(true);
  };

  const handleNewStrategyChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setNewStrategy(prev => {
        const newStrategy = { ...prev };
        if (parent === 'targetReturn') {
          newStrategy.targetReturn = { ...newStrategy.targetReturn, [child]: value };
        }
        return newStrategy;
      });
    } else {
      setNewStrategy(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleAddStrategy = () => {
    const strategy: Strategy = {
      id: Date.now().toString(),
      name: newStrategy.name,
      type: newStrategy.type,
      status: 'stopped',
      riskLevel: newStrategy.riskLevel,
      performance: {
        monthlyReturn: 0,
        totalReturn: 0,
        annualizedReturn: 0,
        winRate: 0,
        maxDrawdown: 0,
        sharpeRatio: 0,
        volatility: 0,
        profitFactor: 0
      },
      targetReturn: newStrategy.targetReturn,
      parameters: {},
      returns: [],
      trades: [],
      backtestResults: [],
      optimizationResults: [],
      lastUpdated: new Date().toISOString()
    };

    setStrategies(prev => [...prev, strategy]);
    setIsNewStrategyDialogOpen(false);
    setNewStrategy({
      name: '',
      type: '',
      riskLevel: 'medium',
      targetReturn: {
        monthly: 0,
        annual: 0,
      },
    });
  };

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setShowDetails(true);
  };

  const handleBacktestConfigChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setBacktestConfig(prev => {
        const newConfig = { ...prev };
        if (parent === 'parameters') {
          newConfig.parameters = { ...newConfig.parameters, [child]: value };
        } else {
          (newConfig[parent as keyof BacktestConfig] as Record<string, any>)[child] = value;
        }
        return newConfig;
      });
    } else {
      setBacktestConfig(prev => ({
        ...prev,
        [field]: value,
      }));
      if (field === 'strategyId') {
        handleStrategySelect(value);
      }
    }
  };

  const handleOptimizeConfigChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setOptimizeConfig(prev => {
        const newConfig = { ...prev };
        if (parent === 'parameters') {
          newConfig.parameters = { ...newConfig.parameters, [child]: value };
        } else if (parent === 'constraints') {
          newConfig.constraints = { ...newConfig.constraints, [child]: value };
        } else {
          (newConfig[parent as keyof OptimizeConfig] as Record<string, any>)[child] = value;
        }
        return newConfig;
      });
    } else {
      setOptimizeConfig(prev => ({
        ...prev,
        [field]: value,
      }));
      if (field === 'strategyId') {
        handleStrategySelect(value);
      }
    }
  };

  const handleStrategyStatusChange = (strategyId: string, newStatus: 'active' | 'paused' | 'stopped') => {
    setStrategies(prev => prev.map(strategy => 
      strategy.id === strategyId ? { ...strategy, status: newStatus } : strategy
    ));
  };

  const handleDeleteStrategy = (strategyId: string) => {
    setStrategies(prev => prev.filter(strategy => strategy.id !== strategyId));
    if (selectedStrategy?.id === strategyId) {
      setSelectedStrategy(null);
    }
  };

  const getReturnColor = (returnValue: number) => {
    if (returnValue >= 200) return 'success.main';
    if (returnValue >= 100) return 'info.main';
    if (returnValue >= 50) return 'warning.main';
    return 'error.main';
  };

  const handleEditStrategy = (strategy: Strategy) => {
    setEditingStrategy(strategy);
    setIsEditDialogOpen(true);
  };

  const handleEditStrategyChange = (field: NestedStrategyKey, value: any) => {
    if (!editingStrategy) return;
    
    const updatedStrategy = { ...editingStrategy };
    
    if (field === 'targetReturn.monthly') {
      updatedStrategy.targetReturn = {
        ...updatedStrategy.targetReturn,
        monthly: value
      };
    } else if (field === 'targetReturn.annual') {
      updatedStrategy.targetReturn = {
        ...updatedStrategy.targetReturn,
        annual: value
      };
    } else {
      (updatedStrategy as any)[field] = value;
    }
    
    setEditingStrategy(updatedStrategy);
  };

  const handleSaveStrategy = async () => {
    if (!editingStrategy) return;
    
    try {
      await strategyService.updateStrategy(editingStrategy);
      const updatedStrategies = strategies.map(s => 
        s.id === editingStrategy.id ? editingStrategy : s
      );
      setStrategies(updatedStrategies);
      setEditingStrategy(null);
    } catch (error) {
      console.error('Error saving strategy:', error);
    }
  };

  const handleStrategyUpdate = async (strategy: Strategy) => {
    try {
      await strategyService.updateStrategy(strategy);
      const updatedStrategies = await strategyService.getStrategies();
      setStrategies(updatedStrategies as Strategy[]);
    } catch (error) {
      console.error('Error updating strategy:', error);
    }
  };

  const fetchStrategies = async () => {
    try {
      const data = await strategyService.getStrategies();
      setStrategies(data as Strategy[]);
    } catch (error) {
      console.error('Error fetching strategies:', error);
    }
  };

  const renderStrategyTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{t('strategyManagement.name')}</TableCell>
            <TableCell>{t('strategyManagement.type')}</TableCell>
            <TableCell>{t('strategyManagement.status')}</TableCell>
            <TableCell>{t('strategyManagement.riskLevel')}</TableCell>
            <TableCell>{t('strategyManagement.monthlyReturn')}</TableCell>
            <TableCell>{t('strategyManagement.targetReturn')}</TableCell>
            <TableCell>{t('strategyManagement.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {strategies.map((strategy) => (
            <TableRow key={strategy.id}>
              <TableCell>{strategy.name}</TableCell>
              <TableCell>{strategy.type}</TableCell>
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
                <Chip
                  label={strategy.riskLevel}
                  color={
                    strategy.riskLevel === 'low'
                      ? 'success'
                      : strategy.riskLevel === 'medium'
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
              <TableCell>
                <Typography
                  variant="body2"
                  color={getReturnColor(strategy.targetReturn.monthly)}
                  sx={{ fontWeight: 'bold' }}
                >
                  {strategy.targetReturn.monthly}%
                </Typography>
              </TableCell>
              <TableCell>
                <Tooltip title={t('strategyManagement.startStrategy')}>
                  <IconButton
                    size="small"
                    onClick={() => handleStrategyStatusChange(strategy.id, 'active')}
                    disabled={strategy.status === 'active'}
                  >
                    <PlayArrowIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('strategyManagement.pauseStrategy')}>
                  <IconButton
                    size="small"
                    onClick={() => handleStrategyStatusChange(strategy.id, 'paused')}
                    disabled={strategy.status === 'paused'}
                  >
                    <PauseIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('strategyManagement.stopStrategy')}>
                  <IconButton
                    size="small"
                    onClick={() => handleStrategyStatusChange(strategy.id, 'stopped')}
                    disabled={strategy.status === 'stopped'}
                  >
                    <StopIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t('strategyManagement.deleteStrategy')}>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteStrategy(strategy.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const StrategyDetails: React.FC<{ strategy: Strategy }> = ({ strategy }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <StrategyReturnDistribution returns={strategy.returns} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RiskMetricsRadar metrics={{
              sharpeRatio: strategy.performance.sharpeRatio,
              maxDrawdown: strategy.performance.maxDrawdown,
              volatility: strategy.performance.volatility,
              winRate: strategy.performance.winRate,
              profitFactor: strategy.performance.profitFactor
            }} />
          </Grid>
          <Grid item xs={12}>
            <TradeFrequencyHeatmap trades={strategy.trades.map(trade => ({
              time: trade.date,
              frequency: 1
            }))} />
          </Grid>
        </Grid>
      </Box>
    );
  };

  const StrategyReturnDistribution: React.FC<{ returns: Array<{ date: string; value: number }> }> = ({ returns }) => {
    const { t } = useTranslation();
    const theme = useTheme();
    
    // 计算收益分布
    const minReturn = Math.min(...returns.map(r => r.value));
    const maxReturn = Math.max(...returns.map(r => r.value));
    const range = maxReturn - minReturn;
    const binCount = 10;
    const binSize = range / binCount;
    
    const distribution = Array(binCount).fill(0);
    returns.forEach(ret => {
      const binIndex = Math.min(Math.floor((ret.value - minReturn) / binSize), binCount - 1);
      distribution[binIndex]++;
    });

    const data = distribution.map((count, index) => ({
      range: `${(minReturn + index * binSize).toFixed(2)}% - ${(minReturn + (index + 1) * binSize).toFixed(2)}%`,
      count
    }));

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('strategy.returnDistribution')}
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <RechartsTooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill={theme.palette.primary.main}>
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        parseFloat(entry.range.split(' - ')[0]) >= 200
                          ? theme.palette.success.main
                          : parseFloat(entry.range.split(' - ')[0]) >= 100
                          ? theme.palette.info.main
                          : parseFloat(entry.range.split(' - ')[0]) >= 50
                          ? theme.palette.warning.main
                          : theme.palette.error.main
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const RiskMetricsRadar: React.FC<{ metrics: { 
    sharpeRatio: number;
    maxDrawdown: number;
    volatility: number;
    winRate: number;
    profitFactor: number;
  } }> = ({ metrics }) => {
    const { t } = useTranslation();
    
    const data = [
      {
        subject: t('strategy.sharpeRatio'),
        value: metrics.sharpeRatio || 0,
        fullMark: 3
      },
      {
        subject: t('strategy.maxDrawdown'),
        value: metrics.maxDrawdown || 0,
        fullMark: 50
      },
      {
        subject: t('strategy.volatility'),
        value: metrics.volatility || 0,
        fullMark: 30
      },
      {
        subject: t('strategy.winRate'),
        value: metrics.winRate || 0,
        fullMark: 100
      },
      {
        subject: t('strategy.profitFactor'),
        value: metrics.profitFactor || 0,
        fullMark: 2
      }
    ];

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('strategy.riskMetrics')}
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={data}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis />
                <Radar
                  name="Metrics"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    );
  };

  const TradeFrequencyHeatmap: React.FC<{ trades: { time: string; frequency: number }[] }> = ({ trades }) => {
    const { t } = useTranslation();
    const theme = useTheme();

    // 如果没有交易数据，显示空状态
    if (!trades || trades.length === 0) {
      return (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('strategyManagement.tradeFrequency')}
            </Typography>
            <Typography color="textSecondary">
              {t('strategyManagement.noTradeData')}
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t('strategyManagement.tradeFrequency')}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trades}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Bar dataKey="frequency" fill={theme.palette.primary.main} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  };

  const renderStrategyDetails = () => {
    if (!selectedStrategy) return null;
    return (
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t('strategyManagement.strategyDetails')}
          <IconButton
            onClick={() => setShowDetails(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <StrategyDetails strategy={selectedStrategy} />
        </DialogContent>
      </Dialog>
    );
  };

  const BacktestResults: React.FC<{ results: BacktestResult[] }> = ({ results }) => {
    if (!results || results.length === 0) return null;
    
    const latestResult = results[results.length - 1];
    
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          {t('strategyManagement.backtestResults')}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('strategyManagement.equityCurve')}
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={latestResult.equityCurve}>
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
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('strategyManagement.performanceMetrics')}
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>{t('strategyManagement.totalReturn')}</TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            color={getReturnColor(latestResult.totalReturn)}
                            sx={{ fontWeight: 'bold' }}
                          >
                            {latestResult.totalReturn}%
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.monthlyReturn')}</TableCell>
                        <TableCell>
                          {latestResult.monthlyReturn}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.annualizedReturn')}</TableCell>
                        <TableCell>
                          {latestResult.annualizedReturn}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.maxDrawdown')}</TableCell>
                        <TableCell>
                          {latestResult.maxDrawdown}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.sharpeRatio')}</TableCell>
                        <TableCell>
                          {latestResult.sharpeRatio}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.winRate')}</TableCell>
                        <TableCell>
                          {latestResult.winRate}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {t('strategyManagement.tradeStatistics')}
                </Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell>{t('strategyManagement.totalTrades')}</TableCell>
                        <TableCell>
                          {latestResult.totalTrades}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.winningTrades')}</TableCell>
                        <TableCell>
                          {latestResult.winningTrades}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.losingTrades')}</TableCell>
                        <TableCell>
                          {latestResult.losingTrades}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.avgTradeReturn')}</TableCell>
                        <TableCell>
                          {latestResult.avgTradeReturn}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.avgWinReturn')}</TableCell>
                        <TableCell>
                          {latestResult.avgWinReturn}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{t('strategyManagement.avgLossReturn')}</TableCell>
                        <TableCell>
                          {latestResult.avgLossReturn}%
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  const renderBacktestResults = () => {
    if (!selectedStrategy) return null;
    return (
      <Dialog
        open={showBacktestResults}
        onClose={() => setShowBacktestResults(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {t('strategyManagement.backtestResults')}
          <IconButton
            onClick={() => setShowBacktestResults(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <BacktestResults results={selectedStrategy.backtestResults} />
        </DialogContent>
      </Dialog>
    );
  };

  const renderOptimizationResults = () => {
    if (!selectedStrategy) return null;

    return (
      <Dialog
        open={showOptimizationResults}
        onClose={() => setShowOptimizationResults(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              {t('strategyManagement.optimizationResults')} - {selectedStrategy.name}
            </Typography>
            <IconButton onClick={() => setShowOptimizationResults(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('strategyManagement.parameters')}</TableCell>
                        <TableCell align="right">{t('strategyManagement.monthlyReturn')}</TableCell>
                        <TableCell align="right">{t('strategyManagement.annualizedReturn')}</TableCell>
                        <TableCell align="right">{t('strategyManagement.sharpeRatio')}</TableCell>
                        <TableCell align="right">{t('strategyManagement.maxDrawdown')}</TableCell>
                        <TableCell align="right">{t('strategyManagement.winRate')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedStrategy.optimizationResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {Object.entries(result.parameters).map(([key, value]) => (
                              <Typography key={key} variant="body2">
                                {key}: {String(value)}
                              </Typography>
                            ))}
                          </TableCell>
                          <TableCell align="right">
                            <Typography
                              variant="body2"
                              color={getReturnColor(result.metrics.monthlyReturn)}
                              sx={{ fontWeight: 'bold' }}
                            >
                              {result.metrics.monthlyReturn}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            {result.metrics.annualizedReturn}%
                          </TableCell>
                          <TableCell align="right">
                            {result.metrics.sharpeRatio.toFixed(2)}
                          </TableCell>
                          <TableCell align="right">
                            {result.metrics.maxDrawdown}%
                          </TableCell>
                          <TableCell align="right">
                            {result.metrics.winRate}%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('strategyManagement.performanceComparison')}
                    </Typography>
                    <Box sx={{ height: 400 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={selectedStrategy.optimizationResults.map(result => ({
                            ...result.metrics,
                            parameters: JSON.stringify(result.parameters),
                          }))}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="parameters" />
                          <YAxis />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Bar dataKey="monthlyReturn" name={t('strategyManagement.monthlyReturn')} fill="#8884d8" />
                          <Bar dataKey="sharpeRatio" name={t('strategyManagement.sharpeRatio')} fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    );
  };

  const renderBacktestDialog = (): JSX.Element => (
    <Dialog
      open={isBacktestDialogOpen}
      onClose={() => setIsBacktestDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{t('strategyManagement.backtestSettings')}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={backtestStep} sx={{ mb: 3 }}>
          <Step>
            <StepLabel>{t('strategyManagement.selectStrategy')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('strategyManagement.setParameters')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('strategyManagement.runBacktest')}</StepLabel>
          </Step>
        </Stepper>
        {backtestStep === 0 && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('strategyManagement.selectStrategy')}</InputLabel>
            <Select
              value={backtestConfig.strategyId}
              label={t('strategyManagement.selectStrategy')}
              onChange={(e) => handleBacktestConfigChange('strategyId', e.target.value)}
            >
              {strategies.map((strategy) => (
                <MenuItem key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {backtestStep === 1 && (
          <Box>
            <TextField
              fullWidth
              type="date"
              label={t('strategyManagement.startDate')}
              value={backtestConfig.startDate}
              onChange={(e) => handleBacktestConfigChange('startDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="date"
              label={t('strategyManagement.endDate')}
              value={backtestConfig.endDate}
              onChange={(e) => handleBacktestConfigChange('endDate', e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label={t('strategyManagement.initialCapital')}
              value={backtestConfig.initialCapital}
              onChange={(e) => handleBacktestConfigChange('initialCapital', parseFloat(e.target.value))}
              sx={{ mb: 2 }}
            />
            {selectedStrategy && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {t('strategyManagement.strategyParameters')}
                </Typography>
                {Object.entries(selectedStrategy.parameters).map(([key, value]) => (
                  <TextField
                    key={key}
                    fullWidth
                    label={key}
                    value={backtestConfig.parameters[key] || value}
                    onChange={(e) => handleBacktestConfigChange(`parameters.${key}`, e.target.value)}
                    sx={{ mb: 2 }}
                  />
                ))}
              </Box>
            )}
          </Box>
        )}
        {backtestStep === 2 && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('strategyManagement.backtestSummary')}
            </Typography>
            <Typography variant="body2">
              {t('strategyManagement.strategy')}: {strategies.find(s => s.id === backtestConfig.strategyId)?.name}
            </Typography>
            <Typography variant="body2">
              {t('strategyManagement.period')}: {backtestConfig.startDate} - {backtestConfig.endDate}
            </Typography>
            <Typography variant="body2">
              {t('strategyManagement.initialCapital')}: ${backtestConfig.initialCapital}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsBacktestDialogOpen(false)}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (backtestStep < 2) {
              setBacktestStep(backtestStep + 1);
            } else {
              // Run backtest
              setIsBacktestDialogOpen(false);
              setBacktestStep(0);
            }
          }}
          disabled={
            (backtestStep === 0 && !backtestConfig.strategyId) ||
            (backtestStep === 1 && (!backtestConfig.startDate || !backtestConfig.endDate))
          }
        >
          {backtestStep === 2 ? t('strategyManagement.run') : t('common.next')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderOptimizeDialog = (): JSX.Element => (
    <Dialog
      open={isOptimizeDialogOpen}
      onClose={() => setIsOptimizeDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>{t('strategyManagement.optimizerSettings')}</DialogTitle>
      <DialogContent>
        <Stepper activeStep={optimizeStep} sx={{ mb: 3 }}>
          <Step>
            <StepLabel>{t('strategyManagement.selectStrategy')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('strategyManagement.setParameters')}</StepLabel>
          </Step>
          <Step>
            <StepLabel>{t('strategyManagement.runOptimizer')}</StepLabel>
          </Step>
        </Stepper>
        {optimizeStep === 0 && (
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('strategyManagement.selectStrategy')}</InputLabel>
            <Select
              value={optimizeConfig.strategyId}
              label={t('strategyManagement.selectStrategy')}
              onChange={(e) => handleOptimizeConfigChange('strategyId', e.target.value)}
            >
              {strategies.map((strategy) => (
                <MenuItem key={strategy.id} value={strategy.id}>
                  {strategy.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {optimizeStep === 1 && (
          <Box>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('strategyManagement.optimizationTarget')}</InputLabel>
              <Select
                value={optimizeConfig.optimizationTarget}
                label={t('strategyManagement.optimizationTarget')}
                onChange={(e) => handleOptimizeConfigChange('optimizationTarget', e.target.value)}
              >
                <MenuItem value="monthlyReturn">{t('strategyManagement.monthlyReturn')}</MenuItem>
                <MenuItem value="sharpeRatio">{t('strategyManagement.sharpeRatio')}</MenuItem>
                <MenuItem value="winRate">{t('strategyManagement.winRate')}</MenuItem>
              </Select>
            </FormControl>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
              {t('strategyManagement.constraints')}
            </Typography>
            <TextField
              fullWidth
              type="number"
              label={t('strategyManagement.maxDrawdown')}
              value={optimizeConfig.constraints.maxDrawdown}
              onChange={(e) => handleOptimizeConfigChange('constraints.maxDrawdown', parseFloat(e.target.value))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              type="number"
              label={t('strategyManagement.minWinRate')}
              value={optimizeConfig.constraints.minWinRate}
              onChange={(e) => handleOptimizeConfigChange('constraints.minWinRate', parseFloat(e.target.value))}
              sx={{ mb: 2 }}
            />
            {selectedStrategy && (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>
                  {t('strategyManagement.parameterRanges')}
                </Typography>
                {Object.entries(selectedStrategy.parameters).map(([key, value]) => (
                  <Box key={key} sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      fullWidth
                      label={`${key} Min`}
                      value={optimizeConfig.parameters[`${key}Min`] || value}
                      onChange={(e) => handleOptimizeConfigChange(`parameters.${key}Min`, e.target.value)}
                    />
                    <TextField
                      fullWidth
                      label={`${key} Max`}
                      value={optimizeConfig.parameters[`${key}Max`] || value}
                      onChange={(e) => handleOptimizeConfigChange(`parameters.${key}Max`, e.target.value)}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}
        {optimizeStep === 2 && (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {t('strategyManagement.optimizationSummary')}
            </Typography>
            <Typography variant="body2">
              {t('strategyManagement.strategy')}: {strategies.find(s => s.id === optimizeConfig.strategyId)?.name}
            </Typography>
            <Typography variant="body2">
              {t('strategyManagement.optimizationTarget')}: {optimizeConfig.optimizationTarget}
            </Typography>
            <Typography variant="body2">
              {t('strategyManagement.maxDrawdown')}: {optimizeConfig.constraints.maxDrawdown}%
            </Typography>
            <Typography variant="body2">
              {t('strategyManagement.minWinRate')}: {optimizeConfig.constraints.minWinRate}%
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsOptimizeDialogOpen(false)}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (optimizeStep < 2) {
              setOptimizeStep(optimizeStep + 1);
            } else {
              // Run optimizer
              setIsOptimizeDialogOpen(false);
              setOptimizeStep(0);
            }
          }}
          disabled={
            (optimizeStep === 0 && !optimizeConfig.strategyId) ||
            (optimizeStep === 1 && !optimizeConfig.optimizationTarget)
          }
        >
          {optimizeStep === 2 ? t('strategyManagement.run') : t('common.next')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderNewStrategyDialog = (): JSX.Element => (
    <Dialog
      open={isNewStrategyDialogOpen}
      onClose={() => setIsNewStrategyDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t('strategyManagement.addNewStrategy')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label={t('strategyManagement.name')}
            value={newStrategy.name}
            onChange={(e) => handleNewStrategyChange('name', e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('strategyManagement.type')}</InputLabel>
            <Select
              value={newStrategy.type}
              label={t('strategyManagement.type')}
              onChange={(e) => handleNewStrategyChange('type', e.target.value)}
            >
              <MenuItem value="trend">Trend Following</MenuItem>
              <MenuItem value="meanReversion">Mean Reversion</MenuItem>
              <MenuItem value="arbitrage">Arbitrage</MenuItem>
              <MenuItem value="marketMaking">Market Making</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('strategyManagement.riskLevel')}</InputLabel>
            <Select
              value={newStrategy.riskLevel}
              label={t('strategyManagement.riskLevel')}
              onChange={(e) => handleNewStrategyChange('riskLevel', e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label={t('strategyManagement.monthlyTargetReturn')}
            value={newStrategy.targetReturn.monthly}
            onChange={(e) => handleNewStrategyChange('targetReturn.monthly', parseFloat(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label={t('strategyManagement.annualTargetReturn')}
            value={newStrategy.targetReturn.annual}
            onChange={(e) => handleNewStrategyChange('targetReturn.annual', parseFloat(e.target.value))}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsNewStrategyDialogOpen(false)}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleAddStrategy}
          disabled={!newStrategy.name || !newStrategy.type}
        >
          {t('common.add')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderEditDialog = (): JSX.Element => (
    <Dialog
      open={isEditDialogOpen}
      onClose={() => setIsEditDialogOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{t('strategyManagement.editStrategy')}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label={t('strategyManagement.name')}
            value={editingStrategy?.name || ''}
            onChange={(e) => handleEditStrategyChange('name', e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('strategyManagement.type')}</InputLabel>
            <Select
              value={editingStrategy?.type || ''}
              label={t('strategyManagement.type')}
              onChange={(e) => handleEditStrategyChange('type', e.target.value)}
            >
              <MenuItem value="trend">Trend Following</MenuItem>
              <MenuItem value="meanReversion">Mean Reversion</MenuItem>
              <MenuItem value="arbitrage">Arbitrage</MenuItem>
              <MenuItem value="marketMaking">Market Making</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>{t('strategyManagement.riskLevel')}</InputLabel>
            <Select
              value={editingStrategy?.riskLevel || 'medium'}
              label={t('strategyManagement.riskLevel')}
              onChange={(e) => handleEditStrategyChange('riskLevel', e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            type="number"
            label={t('strategyManagement.monthlyTargetReturn')}
            value={editingStrategy?.targetReturn.monthly || 0}
            onChange={(e) => handleEditStrategyChange('targetReturn.monthly', parseFloat(e.target.value))}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label={t('strategyManagement.annualTargetReturn')}
            value={editingStrategy?.targetReturn.annual || 0}
            onChange={(e) => handleEditStrategyChange('targetReturn.annual', parseFloat(e.target.value))}
            sx={{ mb: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mb: 2 }}>
            {t('strategyManagement.parameters')}
          </Typography>
          {editingStrategy && Object.entries(editingStrategy.parameters).map(([key, value]) => (
            <TextField
              key={key}
              fullWidth
              label={key}
              value={value}
              onChange={(e) => handleEditStrategyChange(key as NestedStrategyKey, e.target.value)}
              sx={{ mb: 2 }}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsEditDialogOpen(false)}>
          {t('common.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveStrategy}
          disabled={!editingStrategy?.name || !editingStrategy?.type}
        >
          {t('common.save')}
        </Button>
      </DialogActions>
    </Dialog>
  );

  const renderPerformanceCharts = (strategy: Strategy) => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('strategyManagement.equityCurve')}
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={strategy.backtestResults[0]?.equityCurve || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
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
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('strategyManagement.performanceMetrics')}
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    {
                      name: t('strategyManagement.monthlyReturn'),
                      value: strategy.performance.monthlyReturn,
                    },
                    {
                      name: t('strategyManagement.winRate'),
                      value: strategy.performance.winRate,
                    },
                    {
                      name: t('strategyManagement.sharpeRatio'),
                      value: strategy.performance.sharpeRatio,
                    },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {t('strategyManagement.drawdown')}
            </Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={strategy.backtestResults[0]?.equityCurve.map((point, index, array) => ({
                    date: point.date,
                    value: ((point.value - Math.max(...array.slice(0, index + 1).map(p => p.value))) / Math.max(...array.slice(0, index + 1).map(p => p.value))) * 100,
                  })) || []}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#ff7300"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const CustomTooltip: React.FC<{ active?: boolean; payload?: any[]; label?: string }> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{label}</p>
          <p className="value">{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.03) 0%, rgba(0, 0, 0, 0) 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div variants={fadeIn}>
            <Typography
              variant="h2"
              sx={{
                color: '#00FFB8',
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              }}
            >
              策略管理
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="策略列表"
                  gradient
                  animation
                >
                  {renderStrategyTable()}
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="策略详情"
                  gradient
                  animation
                >
                  {selectedStrategy && renderStrategyDetails()}
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="回测结果"
                  gradient
                  animation
                >
                  {showBacktestResults && renderBacktestResults()}
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="优化结果"
                  gradient
                  animation
                >
                  {showOptimizationResults && renderOptimizationResults()}
                </PandaCard>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* 对话框组件 */}
      {renderBacktestDialog()}
      {renderOptimizeDialog()}
      {renderNewStrategyDialog()}
      {renderEditDialog()}
    </Box>
  );
};

export default StrategyManagement; 