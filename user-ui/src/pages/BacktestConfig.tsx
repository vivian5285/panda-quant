import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { themeUtils } from '../theme';
import api from '../services/api';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaInput from '../components/common/PandaInput';
import PandaSelect from '../components/common/PandaSelect';
import PandaAlert from '../components/common/PandaAlert';
import { 
  PlayArrow as PlayArrowIcon,
  ArrowBack as ArrowBackIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';

interface StrategyConfig {
  strategyName: string;
  riskLevel: string;
  symbol: string;
  timeframe: string;
  initialCapital: number;
  startDate: string;
  endDate: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const BacktestConfig: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [config, setConfig] = useState<StrategyConfig>({
    strategyName: '',
    riskLevel: '',
    symbol: '',
    timeframe: '',
    initialCapital: 10000,
    startDate: '',
    endDate: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof StrategyConfig) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: string } }
  ) => {
    const value = event.target.value;
    setConfig(prev => ({
      ...prev,
      [field]: field === 'initialCapital' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/backtest/run', config);
      navigate('/strategies/backtest/results', { state: { result: response.data } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
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
            {t('backtest.config.title')}
          </Typography>
        </Box>

        <PandaCard
          sx={{
            p: 4,
            maxWidth: 'md',
            mx: 'auto'
          }}
        >
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <PandaSelect
                  label={t('backtest.config.strategy')}
                  value={config.strategyName}
                  onChange={handleChange('strategyName')}
                  required
                  startIcon={<TrendingUpIcon />}
                  options={[
                    { value: 'trend_following', label: t('strategyType.trend_following') },
                    { value: 'mean_reversion', label: t('strategyType.mean_reversion') },
                    { value: 'breakout', label: t('strategyType.breakout') }
                  ]}
                />
              </Grid>

              <Grid item xs={12}>
                <PandaSelect
                  label={t('backtest.config.riskLevel')}
                  value={config.riskLevel}
                  onChange={handleChange('riskLevel')}
                  required
                  startIcon={<SecurityIcon />}
                  options={[
                    { value: 'low', label: t('riskLevel.low') },
                    { value: 'medium', label: t('riskLevel.medium') },
                    { value: 'high', label: t('riskLevel.high') }
                  ]}
                />
              </Grid>

              <Grid item xs={12}>
                <PandaSelect
                  label={t('backtest.config.symbol')}
                  value={config.symbol}
                  onChange={handleChange('symbol')}
                  required
                  startIcon={<AttachMoneyIcon />}
                  options={[
                    { value: 'BTC/USDT', label: 'BTC/USDT' },
                    { value: 'ETH/USDT', label: 'ETH/USDT' },
                    { value: 'BNB/USDT', label: 'BNB/USDT' }
                  ]}
                />
              </Grid>

              <Grid item xs={12}>
                <PandaSelect
                  label={t('backtest.config.timeframe')}
                  value={config.timeframe}
                  onChange={handleChange('timeframe')}
                  required
                  startIcon={<TimelineIcon />}
                  options={[
                    { value: '1h', label: t('timeframe.1h') },
                    { value: '4h', label: t('timeframe.4h') },
                    { value: '1d', label: t('timeframe.1d') }
                  ]}
                />
              </Grid>

              <Grid item xs={12}>
                <PandaInput
                  label={t('backtest.config.initialCapital')}
                  type="number"
                  value={config.initialCapital}
                  onChange={handleChange('initialCapital')}
                  required
                  startIcon={<AttachMoneyIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PandaInput
                  label={t('backtest.config.startDate')}
                  type="date"
                  value={config.startDate}
                  onChange={handleChange('startDate')}
                  required
                  startIcon={<CalendarIcon />}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <PandaInput
                  label={t('backtest.config.endDate')}
                  type="date"
                  value={config.endDate}
                  onChange={handleChange('endDate')}
                  required
                  startIcon={<CalendarIcon />}
                />
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <PandaAlert severity="error">{error}</PandaAlert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <PandaButton
                    type="submit"
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    loading={loading}
                    animate
                    glow
                  >
                    {t('backtest.config.run')}
                  </PandaButton>
                </Box>
              </Grid>
            </Grid>
          </form>
        </PandaCard>
      </motion.div>
    </Box>
  );
};

export default BacktestConfig; 