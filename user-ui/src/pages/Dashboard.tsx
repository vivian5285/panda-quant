import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../hooks/useWeb3';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import { PandaAlert } from '../components/common/PandaAlert';
import { PandaProgress } from '../components/common/PandaProgress';
import { ArrowForward as ArrowForwardIcon } from '@mui/icons-material';

interface Strategy {
  id: number;
  name: string;
  description: string;
  path: string;
  icon: string;
  progress: number;
  status: 'active' | 'inactive' | 'completed';
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { account } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [strategies, setStrategies] = useState<Strategy[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchStrategies = async () => {
      try {
        // TODO: 实现策略数据的获取
        setStrategies([
          {
            id: 1,
            name: t('strategies.arbitrage.name'),
            description: t('strategies.arbitrage.description'),
            path: '/strategy/1',
            icon: '🔄',
            progress: 75,
            status: 'active'
          },
          {
            id: 2,
            name: t('strategies.trend.name'),
            description: t('strategies.trend.description'),
            path: '/strategy/2',
            icon: '📈',
            progress: 45,
            status: 'active'
          },
          {
            id: 3,
            name: t('strategies.momentum.name'),
            description: t('strategies.momentum.description'),
            path: '/strategy/3',
            icon: '⚡',
            progress: 90,
            status: 'completed'
          },
        ]);
      } catch (err) {
        setError(t('dashboard.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchStrategies();
  }, [isAuthenticated, navigate, t]);

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
        <PandaAlert severity="error" message={error} />
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
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            background: themeUtils.createGradient('primary.main', 'primary.light'),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {t('dashboard.welcome')}, {user?.username}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            mb: 4
          }}
        >
          {t('dashboard.connectedAccount')}: {account}
        </Typography>

        <Grid container spacing={3}>
          {strategies.map((strategy) => (
            <Grid item xs={12} sm={6} md={4} key={strategy.id}>
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
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {strategy.name}
                    </Typography>
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

                  <Box sx={{ mb: 2 }}>
                    <PandaProgress 
                      value={strategy.progress}
                    />
                  </Box>

                  <PandaButton
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(strategy.path)}
                    animate
                    glow
                  >
                    {t('dashboard.viewStrategy')}
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

export default Dashboard; 