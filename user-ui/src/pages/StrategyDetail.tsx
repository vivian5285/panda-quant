import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  IconButton,
  Tooltip,
  LinearProgress,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import {
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Stop as StopIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { StrategyReturnDistribution, RiskMetricsRadar, TradeFrequencyHeatmap } from '../components/charts';
import GlobalBackground from '../components/GlobalBackground';
import Navbar from '../components/Navbar';

interface StrategyDetailProps {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'paused' | 'stopped';
  riskLevel: 'low' | 'medium' | 'high';
  performance: {
    monthlyReturn: number;
    winRate: number;
    maxDrawdown: number;
    totalReturn: number;
    annualizedReturn: number;
  };
}

const StrategyDetail: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<StrategyDetailProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟获取策略详情
    const fetchStrategyDetail = async () => {
      try {
        setLoading(true);
        // 模拟API调用
        const mockStrategy: StrategyDetailProps = {
          id: id || '1',
          name: 'Trend Following',
          type: 'trend',
          status: 'running',
          riskLevel: 'medium',
          performance: {
            monthlyReturn: 85.2,
            winRate: 65,
            maxDrawdown: 15.2,
            totalReturn: 1022.4,
            annualizedReturn: 1022.4,
          },
        };
        setStrategy(mockStrategy);
      } catch (error) {
        console.error('Error fetching strategy detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStrategyDetail();
  }, [id]);

  const handleStrategyAction = async (action: 'start' | 'stop' | 'pause') => {
    if (!strategy) return;
    
    try {
      // 模拟API调用
      setStrategy(prev => prev ? {
        ...prev,
        status: action === 'start' ? 'running' : action === 'pause' ? 'paused' : 'stopped'
      } : null);
    } catch (error) {
      console.error('Error performing strategy action:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  if (!strategy) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="error">
          {t('strategy.notFound')}
        </Typography>
      </Box>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {strategy.name}
              </Typography>
            </Box>
          </motion.div>

          {/* Strategy Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    background: themeUtils.gradients.primary,
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {t('strategy.status')}
                      </Typography>
                      <Chip
                        label={t(`strategy.status.${strategy.status}`)}
                        color={
                          strategy.status === 'running'
                            ? 'success'
                            : strategy.status === 'paused'
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6">
                        {t('strategy.riskLevel')}
                      </Typography>
                      <Chip
                        label={t(`strategy.risk.${strategy.riskLevel}`)}
                        color={
                          strategy.riskLevel === 'low'
                            ? 'success'
                            : strategy.riskLevel === 'medium'
                            ? 'warning'
                            : 'error'
                        }
                      />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title={t('strategy.actions.start')}>
                        <IconButton
                          onClick={() => handleStrategyAction('start')}
                          sx={{ color: 'white' }}
                        >
                          <PlayIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('strategy.actions.pause')}>
                        <IconButton
                          onClick={() => handleStrategyAction('pause')}
                          sx={{ color: 'white' }}
                        >
                          <PauseIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t('strategy.actions.stop')}>
                        <IconButton
                          onClick={() => handleStrategyAction('stop')}
                          sx={{ color: 'white' }}
                        >
                          <StopIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Card
                  sx={{
                    background: themeUtils.gradients.secondary,
                    color: 'white',
                    borderRadius: 2,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 3 }}>
                      {t('strategy.performance')}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={3}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {t('strategy.monthlyReturn')}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {strategy.performance.monthlyReturn >= 0 ? (
                              <TrendingUpIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                            ) : (
                              <TrendingDownIcon sx={{ color: theme.palette.error.main, mr: 1 }} />
                            )}
                            <Typography variant="h6">
                              {strategy.performance.monthlyReturn >= 0 ? '+' : ''}
                              {strategy.performance.monthlyReturn.toFixed(2)}%
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {t('strategy.winRate')}
                          </Typography>
                          <Typography variant="h6">
                            {strategy.performance.winRate.toFixed(1)}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {t('strategy.maxDrawdown')}
                          </Typography>
                          <Typography variant="h6" color="error.main">
                            {strategy.performance.maxDrawdown.toFixed(2)}%
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {t('strategy.totalReturn')}
                          </Typography>
                          <Typography variant="h6">
                            {strategy.performance.totalReturn.toFixed(2)}%
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>

          {/* Charts */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <StrategyReturnDistribution
                      data={{
                        labels: ['-5%', '-3%', '-1%', '1%', '3%', '5%'],
                        values: [10, 20, 30, 40, 30, 20]
                      }}
                      title={t('strategy.returnDistribution')}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <RiskMetricsRadar
                      data={{
                        labels: ['波动率', '最大回撤', '夏普比率', '胜率', '盈亏比'],
                        values: [80, 60, 70, 90, 75]
                      }}
                      title={t('strategy.riskMetrics')}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Card>
                  <CardContent>
                    <TradeFrequencyHeatmap
                      data={{
                        labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
                        datasets: [{
                          label: 'BTC/USDT',
                          data: [[10, 20, 30, 40, 50, 60], [15, 25, 35, 45, 55, 65]]
                        }]
                      }}
                      title={t('strategy.tradeFrequency')}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
};

export default StrategyDetail; 