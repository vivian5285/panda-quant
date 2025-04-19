import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Add as AddIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon
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

const Strategies: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStrategies = async () => {
      try {
        setLoading(true);
        const response = await api.get('/strategies');
        setStrategies(response.data.map((strategy: Strategy) => ({
          ...strategy,
          icon: strategy.type === 'arbitrage' ? '🔄' : 
                strategy.type === 'trend' ? '📈' : 
                strategy.type === 'momentum' ? '⚡' : '🎯'
        })));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, []);

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

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <PandaAlert severity="error">{error}</PandaAlert>
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
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 4
          }}
        >
          <Typography 
            variant="h4"
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              background: themeUtils.createGradient('primary'),
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            {t('strategies.title')}
          </Typography>
          <PandaButton
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/strategies/new')}
            animate
            glow
          >
            {t('strategies.createNew')}
          </PandaButton>
        </Box>

        <Grid container spacing={3}>
          {strategies.map((strategy) => (
            <Grid item xs={12} md={6} lg={4} key={strategy._id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <PandaCard
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    p: 3,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h3" sx={{ mr: 2 }}>{strategy.icon}</Typography>
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: 'text.primary'
                        }}
                      >
                        {strategy.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        {getStatusIcon(strategy.status)}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            ml: 1,
                            color: 'text.secondary'
                          }}
                        >
                          {t(`strategyStatus.${strategy.status}`)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 3,
                      flexGrow: 1
                    }}
                  >
                    {strategy.description}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SpeedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {t(`strategyType.${strategy.type}`)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SecurityIcon sx={{ mr: 1, color: getRiskColor(strategy.riskLevel) }} />
                        <Typography 
                          variant="body2" 
                          sx={{ color: getRiskColor(strategy.riskLevel) }}
                        >
                          {strategy.riskLevel}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TrendingUpIcon sx={{ mr: 1, color: 'success.main' }} />
                      <Typography 
                        variant="body2" 
                        sx={{ color: 'success.main' }}
                      >
                        {t('strategy.expectedReturn')}: {strategy.expectedReturn}%
                      </Typography>
                    </Box>
                  </Box>

                  <PandaButton
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/strategies/${strategy._id}`)}
                    animate
                  >
                    {t('strategies.viewDetails')}
                  </PandaButton>
                </PandaCard>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Strategies; 