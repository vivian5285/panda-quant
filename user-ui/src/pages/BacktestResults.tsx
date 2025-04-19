import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { themeUtils } from '../theme';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import { 
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Speed as SpeedIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

interface BacktestResult {
  equityCurve: Array<{
    date: string;
    equity: number;
  }>;
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
}

interface BacktestResultsProps {
  result: BacktestResult;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const BacktestResults: React.FC<BacktestResultsProps> = ({ result }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const formatNumber = (value: number, decimals = 2) => {
    return value.toFixed(decimals);
  };

  const getReturnColor = (value: number) => {
    return value >= 0 ? 'success.main' : 'error.main';
  };

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
            onClick={() => navigate(-1)}
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
            {t('backtest.results.title')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <PandaCard
                sx={{
                  height: '100%',
                  p: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ mr: 2, color: getReturnColor(result.totalReturn) }} />
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('backtest.results.totalReturn')}
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: getReturnColor(result.totalReturn),
                    fontWeight: 600
                  }}
                >
                  {formatNumber(result.totalReturn * 100)}%
                </Typography>
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
                  p: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingDownIcon sx={{ mr: 2, color: 'error.main' }} />
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('backtest.results.maxDrawdown')}
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'error.main',
                    fontWeight: 600
                  }}
                >
                  {formatNumber(result.maxDrawdown * 100)}%
                </Typography>
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
                  p: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SpeedIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('backtest.results.sharpeRatio')}
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600
                  }}
                >
                  {formatNumber(result.sharpeRatio)}
                </Typography>
              </PandaCard>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <PandaCard
                sx={{
                  p: 3
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TimelineIcon sx={{ mr: 2, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                    {t('backtest.results.equityCurve')}
                  </Typography>
                </Box>
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.equityCurve}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={formatDate}
                        stroke="rgba(255, 255, 255, 0.5)"
                      />
                      <YAxis 
                        stroke="rgba(255, 255, 255, 0.5)"
                        tickFormatter={(value) => `$${formatNumber(value)}`}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`$${formatNumber(value)}`, t('backtest.results.equity')]}
                        labelFormatter={formatDate}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="equity" 
                        stroke={themeUtils.getThemeColor('primary')}
                        strokeWidth={2}
                        dot={false}
                        name={t('backtest.results.equity')}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </PandaCard>
            </motion.div>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default BacktestResults; 