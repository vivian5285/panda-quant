import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { themeUtils } from '../theme';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import { PandaAlert } from '../components/common/PandaAlert';
import { PandaProgress } from '../components/common/PandaProgress';
import { PandaTable } from '../components/common/PandaTable';
import { PandaChip } from '../components/common/PandaChip';
import Layout from '../components/Layout';

interface AccountInfo {
  balance: number;
  hostingFee: number;
  status: 'active' | 'insufficient_balance' | 'suspended';
  referralCode: string;
  referralRewards: number;
  commissionHistory: Array<{
    date: string;
    amount: number;
    type: 'direct' | 'indirect';
    fromUser: string;
  }>;
  balanceHistory: Array<{
    date: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'hosting_fee' | 'commission';
    description: string;
  }>;
  hostingFeeHistory: Array<{
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
  }>;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const AccountInfo: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch('/api/user/account-info', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error(t('account.errors.fetchFailed'));
        }

        const data = await response.json();
        setAccountInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('account.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAccountInfo();
    }
  }, [isAuthenticated, t]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'insufficient_balance':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('account.status.active');
      case 'insufficient_balance':
        return t('account.status.insufficient');
      case 'suspended':
        return t('account.status.suspended');
      default:
        return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <PandaAlert severity="warning">{t('account.authRequired')}</PandaAlert>
        </Box>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <PandaProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <PandaAlert severity="error">{error}</PandaAlert>
        </Box>
      </Layout>
    );
  }

  if (!accountInfo) {
    return null;
  }

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          pt: 8,
          pb: 4,
          background: themeUtils.createGradient('primary.main', 'primary.light'),
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/background-pattern.png")',
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 'lg',
            mx: 'auto',
            px: 3,
          }}
        >
          <motion.div {...fadeInUp}>
            <Typography
              variant="h2"
              sx={{
                mb: 6,
                fontWeight: 700,
                background: themeUtils.createGradient('primary'),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                fontSize: { xs: '2.5rem', md: '3rem' },
              }}
            >
              {t('account.title')}
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      {t('account.balance.title')}
                    </Typography>
                    <Typography
                      variant="h3"
                      sx={{
                        mb: 2,
                        fontWeight: 700,
                        color: 'primary.main',
                      }}
                    >
                      ${accountInfo.balance.toFixed(2)}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                      }}
                    >
                      {t('account.hostingFee')}: ${accountInfo.hostingFee.toFixed(2)}/周
                    </Typography>
                  </PandaCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      {t('account.status.title')}
                    </Typography>
                    <PandaChip
                      label={getStatusText(accountInfo.status)}
                      color={getStatusColor(accountInfo.status)}
                      sx={{ mt: 1 }}
                    />
                  </PandaCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={4}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      {t('account.referral.title')}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: 'text.secondary',
                      }}
                    >
                      {t('account.referral.code')}: {accountInfo.referralCode}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        color: 'success.main',
                        fontWeight: 700,
                      }}
                    >
                      ${accountInfo.referralRewards.toFixed(2)}
                    </Typography>
                  </PandaCard>
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      {t('account.history.title')}
                    </Typography>

                    <PandaTable>
                      <thead>
                        <tr>
                          <th>{t('account.history.date')}</th>
                          <th>{t('account.history.amount')}</th>
                          <th>{t('account.history.type')}</th>
                          <th>{t('account.history.description')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accountInfo.balanceHistory.map((record, index) => (
                          <tr key={index}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>${record.amount.toFixed(2)}</td>
                            <td>{t(`account.history.types.${record.type}`)}</td>
                            <td>{record.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </PandaTable>
                  </PandaCard>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </Box>
    </Layout>
  );
};

export default AccountInfo; 