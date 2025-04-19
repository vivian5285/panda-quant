import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import api from '../services/api';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaAlert from '../components/common/PandaAlert';
import PandaProgress from '../components/common/PandaProgress';
import { 
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon,
  AutoGraph as AutoGraphIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

interface Strategy {
  _id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  riskLevel: string;
  expectedReturn: number;
  createdAt: string;
  updatedAt: string;
  icon: string;
  performance: {
    totalTrades: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
  };
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircleIcon sx={{ color: 'success.main' }} />;
    case 'pending':
      return <WarningIcon sx={{ color: 'warning.main' }} />;
    case 'error':
      return <ErrorIcon sx={{ color: 'error.main' }} />;
    default:
      return null;
  }
};

const getRiskColor = (riskLevel: string) => {
  switch (riskLevel.toLowerCase()) {
    case 'low':
      return 'success.main';
    case 'medium':
      return 'warning.main';
    case 'high':
      return 'error.main';
    default:
      return 'text.secondary';
  }
};

const StrategyDetail: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [strategy, setStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategy = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/strategies/${id}`);
        setStrategy({
          ...response.data,
          icon: response.data.type === 'arbitrage' ? '🔄' : 
                response.data.type === 'trend' ? '📈' : 
                response.data.type === 'momentum' ? '⚡' : '🎯',
          performance: {
            totalTrades: 150,
            winRate: 65.5,
            profitFactor: 2.1,
            maxDrawdown: 12.3
          }
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStrategy();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        bgcolor: 'background.default'
      }}>
        <PandaProgress />
      </Box>
    );
  }

  if (error || !strategy) {
    return (
      <Box sx={{ p: 3 }}>
        <PandaAlert severity="error">{error || 'Strategy not found'}</PandaAlert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <motion.div {...fadeInUp}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <PandaButton
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/strategies')}
            sx={{ mr: 2 }}
            animate
          >
            {t('common.back')}
          </PandaButton>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              background: themeUtils.createGradient('primary'),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {strategy.name}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <PandaCard
                sx={{
                  height: '100%',
                  p: 4
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                  <Typography variant="h3" sx={{ mr: 2 }}>{strategy.icon}</Typography>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                      {t('strategy.description')}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                      {strategy.description}
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SpeedIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('strategy.type')}
                        </Typography>
                        <Typography variant="body1">
                          {t(`strategyType.${strategy.type}`)}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon sx={{ mr: 2, color: getRiskColor(strategy.riskLevel) }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('strategy.riskLevel')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: getRiskColor(strategy.riskLevel) }}>
                          {strategy.riskLevel}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TrendingUpIcon sx={{ mr: 2, color: 'success.main' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('strategy.expectedReturn')}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'success.main' }}>
                          {strategy.expectedReturn}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <CalendarIcon sx={{ mr: 2, color: 'text.secondary' }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('strategy.createdAt')}
                        </Typography>
                        <Typography variant="body1">
                          {new Date(strategy.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('strategy.performance')}
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: 'primary.main' }}>
                          {strategy.performance.totalTrades}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('strategy.totalTrades')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: 'success.main' }}>
                          {strategy.performance.winRate}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('strategy.winRate')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: 'success.main' }}>
                          {strategy.performance.profitFactor}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('strategy.profitFactor')}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ color: 'error.main' }}>
                          {strategy.performance.maxDrawdown}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t('strategy.maxDrawdown')}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </PandaCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={4}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <PandaCard
                sx={{
                  height: '100%',
                  p: 4
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('strategy.actions')}
                  </Typography>
                  <PandaButton
                    variant="contained"
                    fullWidth
                    startIcon={<TimelineIcon />}
                    onClick={() => navigate(`/strategies/${id}/backtest`)}
                    sx={{ mb: 2 }}
                    animate
                    glow
                  >
                    {t('strategy.backtest')}
                  </PandaButton>
                  <PandaButton
                    variant="outlined"
                    fullWidth
                    startIcon={<AutoGraphIcon />}
                    onClick={() => navigate(`/strategies/${id}/optimize`)}
                    animate
                  >
                    {t('strategy.optimize')}
                  </PandaButton>
                </Box>

                <Box>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    {t('strategy.status')}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {getStatusIcon(strategy.status)}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {t(`strategyStatus.${strategy.status}`)}
                    </Typography>
                  </Box>
                </Box>
              </PandaCard>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default StrategyDetail; 