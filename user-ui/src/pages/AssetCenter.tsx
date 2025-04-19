import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWeb3 } from '../hooks/useWeb3';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaAlert from '../components/common/PandaAlert';
import PandaProgress from '../components/common/PandaProgress';
import { 
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  ArrowForward as ArrowForwardIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';

interface AssetSummary {
  totalValue: number;
  positions: {
    symbol: string;
    amount: number;
    value: number;
    change24h: number;
    icon: string;
  }[];
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const AssetCenter = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { account } = useWeb3();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetSummary, setAssetSummary] = useState<AssetSummary | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchAssetSummary = async () => {
      try {
        // TODO: 实现资产汇总数据的获取
        setAssetSummary({
          totalValue: 10000,
          positions: [
            {
              symbol: 'ETH',
              amount: 1.5,
              value: 3000,
              change24h: 2.5,
              icon: '🦄'
            },
            {
              symbol: 'BTC',
              amount: 0.1,
              value: 4000,
              change24h: -1.2,
              icon: '🦁'
            },
            {
              symbol: 'USDT',
              amount: 3000,
              value: 3000,
              change24h: 0.1,
              icon: '🦊'
            },
          ],
        });
      } catch (err) {
        setError(t('assetCenter.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchAssetSummary();
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
        <Typography 
          variant="h4" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 600,
            mb: 2,
            background: themeUtils.createGradient('primary'),
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {t('assetCenter.title')}
        </Typography>
        
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'text.secondary',
            mb: 4
          }}
        >
          {t('assetCenter.connectedAccount')}: {account}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <PandaCard
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  p: 3,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalanceIcon sx={{ fontSize: 40, color: '#00FFB8', mr: 2 }} />
                  <Box>
                    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                      {t('assetCenter.totalValue')}
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 600,
                        background: themeUtils.createGradient('primary'),
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                      }}
                    >
                      ${assetSummary?.totalValue.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              </PandaCard>
            </motion.div>
          </Grid>

          {assetSummary?.positions.map((position) => (
            <Grid item xs={12} sm={6} md={4} key={position.symbol}>
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
                    <Typography variant="h3" sx={{ mr: 2 }}>{position.icon}</Typography>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {position.symbol}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: position.change24h >= 0 ? 'success.main' : 'error.main',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <TrendingUpIcon sx={{ mr: 0.5, fontSize: 16 }} />
                        {position.change24h}%
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1
                      }}
                    >
                      <MoneyIcon sx={{ mr: 1, fontSize: 16 }} />
                      {t('assetCenter.amount')}: {position.amount}
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      <MoneyIcon sx={{ mr: 1, fontSize: 16 }} />
                      {t('assetCenter.value')}: ${position.value.toLocaleString()}
                    </Typography>
                  </Box>

                  <PandaButton
                    variant="outlined"
                    fullWidth
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate(`/asset/${position.symbol}`)}
                    animate
                  >
                    {t('assetCenter.viewDetails')}
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

export default AssetCenter; 