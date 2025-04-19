import React, { useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { themeUtils } from '../theme';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaSlider from '../components/common/PandaSlider';
import PandaProgress from '../components/common/PandaProgress';
import { 
  ArrowBack as ArrowBackIcon,
  AutoGraph as AutoGraphIcon,
  Speed as SpeedIcon,
  TrendingUp as TrendingUpIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

interface OptimizationParameter {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
  icon: React.ReactNode;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const StrategyOptimizer: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [parameters, setParameters] = useState<OptimizationParameter[]>([
    { 
      name: 'rsiPeriod', 
      min: 2, 
      max: 30, 
      step: 1, 
      value: 14,
      icon: <SpeedIcon />
    },
    { 
      name: 'macdFast', 
      min: 2, 
      max: 26, 
      step: 1, 
      value: 12,
      icon: <TrendingUpIcon />
    },
    { 
      name: 'macdSlow', 
      min: 10, 
      max: 50, 
      step: 1, 
      value: 26,
      icon: <TimelineIcon />
    },
    { 
      name: 'macdSignal', 
      min: 2, 
      max: 20, 
      step: 1, 
      value: 9,
      icon: <AutoGraphIcon />
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleParameterChange = (index: number, value: number) => {
    setParameters(prev => prev.map((param, i) => 
      i === index ? { ...param, value } : param
    ));
  };

  const handleOptimize = async () => {
    setLoading(true);
    try {
      // 实现优化逻辑
      await new Promise(resolve => setTimeout(resolve, 2000)); // 模拟API调用
      navigate('/strategies/backtest/results', { 
        state: { 
          result: {
            equityCurve: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (30 - i) * 24 * 60 * 60 * 1000).toISOString(),
              equity: 10000 * (1 + i * 0.01)
            })),
            totalReturn: 0.3,
            maxDrawdown: 0.1,
            sharpeRatio: 2.5
          }
        } 
      });
    } catch (error) {
      console.error('Optimization failed:', error);
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
            {t('strategyOptimizer.title')}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {parameters.map((param, index) => (
            <Grid item xs={12} sm={6} key={param.name}>
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
                    {param.icon}
                    <Typography variant="h6" sx={{ ml: 2, color: 'text.secondary' }}>
                      {t(`strategyOptimizer.${param.name}`)}
                    </Typography>
                  </Box>
                  <PandaSlider
                    value={param.value}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    onChange={(_, value) => handleParameterChange(index, value as number)}
                    valueLabelDisplay="auto"
                  />
                </PandaCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <PandaButton
            variant="contained"
            startIcon={<AutoGraphIcon />}
            onClick={handleOptimize}
            loading={loading}
            animate
            glow
          >
            {t('strategyOptimizer.optimize')}
          </PandaButton>
        </Box>
      </motion.div>
    </Box>
  );
};

export default StrategyOptimizer; 