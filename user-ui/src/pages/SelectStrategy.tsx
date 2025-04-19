import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { themeUtils } from '../theme';
import api from '../services/api';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaInput from '../components/common/PandaInput';
import PandaSelect from '../components/common/PandaSelect';
import PandaAlert from '../components/common/PandaAlert';
import { 
  ArrowBack as ArrowBackIcon,
  PlayArrow as PlayArrowIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  AttachMoney as AttachMoneyIcon,
  Timeline as TimelineIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';

interface FormData {
  strategyName: string;
  riskLevel: string;
  symbol: string;
  timeframe: string;
  startDate: Date;
  endDate: Date;
  initialCapital: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const SelectStrategy: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    strategyName: 'superTrend',
    riskLevel: 'medium',
    symbol: 'BTC/USDT',
    timeframe: '1h',
    startDate: new Date('2023-01-01'),
    endDate: new Date('2023-12-31'),
    initialCapital: 10000
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    if (date) {
      setFormData({
        ...formData,
        [field]: date,
      });
    }
  };

  const handleSelectChange = (field: string) => (event: { target: { value: string } }) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/strategy/backtest/run', {
        ...formData,
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString()
      });

      navigate(`/backtest/results/${response.data.id}`);
    } catch (err) {
      setError(t('strategy.select.error'));
      console.error('Error starting backtest:', err);
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
            {t('strategy.select.title')}
          </Typography>
        </Box>

        <PandaCard
          sx={{
            p: 4,
            maxWidth: 'md',
            mx: 'auto'
          }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <PandaSelect
                label={t('strategy.select.strategy')}
                value={formData.strategyName}
                onChange={handleSelectChange('strategyName')}
                required
                startIcon={<TrendingUpIcon />}
                options={[
                  { value: 'superTrend', label: t('strategyType.superTrend') },
                  { value: 'grid', label: t('strategyType.grid') },
                  { value: 'scalping', label: t('strategyType.scalping') }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <PandaSelect
                label={t('strategy.select.riskLevel')}
                value={formData.riskLevel}
                onChange={handleSelectChange('riskLevel')}
                required
                startIcon={<SecurityIcon />}
                options={[
                  { value: 'low', label: t('riskLevel.low') },
                  { value: 'medium', label: t('riskLevel.medium') },
                  { value: 'high', label: t('riskLevel.high') }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <PandaSelect
                label={t('strategy.select.symbol')}
                value={formData.symbol}
                onChange={handleSelectChange('symbol')}
                required
                startIcon={<AttachMoneyIcon />}
                options={[
                  { value: 'BTC/USDT', label: 'BTC/USDT' },
                  { value: 'ETH/USDT', label: 'ETH/USDT' },
                  { value: 'BNB/USDT', label: 'BNB/USDT' }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <PandaSelect
                label={t('strategy.select.timeframe')}
                value={formData.timeframe}
                onChange={handleSelectChange('timeframe')}
                required
                startIcon={<TimelineIcon />}
                options={[
                  { value: '1m', label: t('timeframe.1m') },
                  { value: '5m', label: t('timeframe.5m') },
                  { value: '15m', label: t('timeframe.15m') },
                  { value: '1h', label: t('timeframe.1h') },
                  { value: '4h', label: t('timeframe.4h') },
                  { value: '1d', label: t('timeframe.1d') }
                ]}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('strategy.select.startDate')}
                  value={formData.startDate}
                  onChange={handleDateChange('startDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label={t('strategy.select.endDate')}
                  value={formData.endDate}
                  onChange={handleDateChange('endDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      InputProps: {
                        startAdornment: <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      }
                    }
                  }}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <PandaInput
                label={t('strategy.select.initialCapital')}
                type="number"
                value={formData.initialCapital}
                onChange={handleChange('initialCapital')}
                required
                startIcon={<AttachMoneyIcon />}
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
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleSubmit}
                  loading={loading}
                  animate
                  glow
                >
                  {t('strategy.select.start')}
                </PandaButton>
              </Box>
            </Grid>
          </Grid>
        </PandaCard>
      </motion.div>
    </Box>
  );
};

export default SelectStrategy; 