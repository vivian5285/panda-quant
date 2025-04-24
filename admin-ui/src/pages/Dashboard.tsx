import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Button,
  IconButton,
  Tooltip as MuiTooltip,
  Chip,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
  Refresh as RefreshIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Balance as BalanceIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { getDashboardData, subscribeToDashboardUpdates } from '../api/dashboard';
import PageLayout from '../components/common/PageLayout';
import { animationConfig } from '../theme/animation';
import { theme } from '../theme';

interface DashboardData {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalProfit: number;
  profitTrend: { date: string; profit: number }[];
  userActivity: { date: string; value: number }[];
  highRiskStrategies: {
    id: string;
    name: string;
    riskLevel: 'low' | 'medium' | 'high';
    performance: number;
  }[];
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalProfit: number;
  totalCommission: number;
  totalStrategies: number;
  activeStrategies: number;
}

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalProfit: 0,
    totalCommission: 0,
    totalStrategies: 0,
    activeStrategies: 0
  });

  useEffect(() => {
    fetchDashboardData();
    fetchStats();
    const unsubscribe = subscribeToDashboardUpdates((newData) => {
      setData(newData as unknown as DashboardData);
    });
    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await getDashboardData();
      setData(response as unknown as DashboardData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const renderMetricCard = (title: string, value: number, icon: React.ReactNode, color: string) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card
        sx={{
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${theme.palette.secondary.main})`,
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
            <Box
              sx={{
                p: 1,
                borderRadius: '50%',
                bgcolor: `${color}20`,
                color: color,
              }}
            >
              {icon}
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 500 }}>
            {value.toLocaleString()}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderChart = (title: string, data: { date: string; value: number }[], color: string) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Card sx={{ height: '100%' }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {title}
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderHighRiskStrategies = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              High Risk Strategies
            </Typography>
            <MuiTooltip title="Refresh">
              <span>
                <IconButton onClick={fetchDashboardData}>
                  <RefreshIcon />
                </IconButton>
              </span>
            </MuiTooltip>
          </Box>
          {data?.highRiskStrategies.map((strategy) => (
            <Box
              key={strategy.id}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {strategy.name}
                </Typography>
                <Chip
                  label={strategy.riskLevel}
                  color={
                    strategy.riskLevel === 'high'
                      ? 'error'
                      : strategy.riskLevel === 'medium'
                      ? 'warning'
                      : 'success'
                  }
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Box>
              <Typography
                variant="body1"
                sx={{
                  color: strategy.performance >= 0 ? 'success.main' : 'error.main',
                }}
              >
                {strategy.performance >= 0 ? '+' : ''}
                {(strategy.performance * 100).toFixed(1)}%
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'Total Users',
            data?.totalUsers || 0,
            <PeopleIcon />,
            theme.palette.primary.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'Active Users',
            data?.activeUsers || 0,
            <TrendingUpIcon />,
            theme.palette.success.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'Total Orders',
            data?.totalOrders || 0,
            <TrendingUpIcon />,
            theme.palette.warning.main
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {renderMetricCard(
            'Total Profit',
            data?.totalProfit || 0,
            <MoneyIcon />,
            theme.palette.warning.main
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderChart('Profit Trend', data?.profitTrend.map(item => ({ ...item, value: item.profit })) || [], theme.palette.primary.main)}
        </Grid>
        <Grid item xs={12} md={6}>
          {renderChart('User Activity', data?.userActivity || [], theme.palette.secondary.main)}
        </Grid>
        <Grid item xs={12}>
          {renderHighRiskStrategies()}
        </Grid>
      </Grid>
    </Box>
  );

  const renderActions = () => (
    <Button
      variant="outlined"
      endIcon={<ArrowForwardIcon />}
      sx={{
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
        py: 1.5,
        px: 4,
        fontSize: '1.1rem',
        borderRadius: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(45deg, transparent, rgba(0,255,184,0.1), transparent)',
          transform: 'translateX(-100%)',
          transition: 'transform 0.6s ease',
        },
        '&:hover': {
          borderColor: theme.palette.primary.main,
          bgcolor: `${theme.palette.primary.main}10`,
          transform: 'translateY(-2px)',
          '&::before': {
            transform: 'translateX(100%)',
          },
        },
      }}
    >
      View Details
    </Button>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const statCards = [
    {
      title: '总用户数',
      value: stats.totalUsers,
      icon: <PeopleIcon />,
      color: theme.palette.primary.main
    },
    {
      title: '活跃用户',
      value: stats.activeUsers,
      icon: <TrendingUpIcon />,
      color: theme.palette.success.main
    },
    {
      title: '总收益',
      value: `$${stats.totalProfit.toFixed(2)}`,
      icon: <MoneyIcon />,
      color: theme.palette.warning.main
    },
    {
      title: '总佣金',
      value: `$${stats.totalCommission.toFixed(2)}`,
      icon: <BalanceIcon />,
      color: theme.palette.info.main
    },
    {
      title: '策略总数',
      value: stats.totalStrategies,
      icon: <SecurityIcon />,
      color: theme.palette.secondary.main
    },
    {
      title: '活跃策略',
      value: stats.activeStrategies,
      icon: <SpeedIcon />,
      color: theme.palette.error.main
    }
  ];

  return (
    <PageLayout
      title="Dashboard"
      actions={renderActions()}
      content={renderContent()}
    >
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          mb: 4
        }}>
          仪表盘
        </Typography>

        <Grid container spacing={3}>
          {statCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card sx={{
                  background: `linear-gradient(135deg, ${alpha(card.color, 0.1)} 0%, ${alpha(card.color, 0.05)} 100%)`,
                  boxShadow: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box sx={{ 
                        color: card.color,
                        mr: 1,
                        fontSize: 30
                      }}>
                        {card.icon}
                      </Box>
                      <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                        {card.title}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ 
                      color: card.color,
                      fontWeight: 'bold'
                    }}>
                      {card.value}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </PageLayout>
  );
};

export default Dashboard; 