import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { themeUtils } from '../theme';
import { Info as InfoIcon } from '@mui/icons-material';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaInput from '../components/common/PandaInput';
import PandaSelect from '../components/common/PandaSelect';
import PandaAlert from '../components/common/PandaAlert';
import PandaProgress from '../components/common/PandaProgress';
import PandaDialog from '../components/common/PandaDialog';
import PandaTable from '../components/common/PandaTable';
import Layout from '../components/Layout';

interface WithdrawalRecord {
  id: string;
  amount: number;
  chain: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

interface ChainInfo {
  name: string;
  minAmount: number;
  fee: number;
  feeDescription: string;
}

const CHAINS: ChainInfo[] = [
  {
    name: 'BSC',
    minAmount: 10,
    fee: 0.1,
    feeDescription: 'BSC网络手续费约为0.1 USDT',
  },
  {
    name: 'TRC',
    minAmount: 10,
    fee: 1,
    feeDescription: 'TRC网络手续费约为1 USDT',
  },
  {
    name: 'ARB',
    minAmount: 20,
    fee: 0.5,
    feeDescription: 'ARB网络手续费约为0.5 USDT',
  },
];

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Withdraw: React.FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [amount, setAmount] = useState('');
  const [chain, setChain] = useState('');
  const [address, setAddress] = useState('');
  const [records, setRecords] = useState<WithdrawalRecord[]>([]);
  const [showFeeDialog, setShowFeeDialog] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWithdrawalRecords();
    }
  }, [isAuthenticated]);

  const fetchWithdrawalRecords = async () => {
    try {
      const response = await fetch('/api/user/withdrawal-records', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error(t('withdraw.errors.fetchFailed'));
      }

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('withdraw.errors.fetchFailed'));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          chain,
          address,
        }),
      });

      if (!response.ok) {
        throw new Error(t('withdraw.errors.submitFailed'));
      }

      setSuccess(t('withdraw.success'));
      setAmount('');
      setChain('');
      setAddress('');
      fetchWithdrawalRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : t('withdraw.errors.submitFailed'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): 'error' | 'info' | 'success' | 'warning' => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'info';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('withdraw.status.pending');
      case 'approved':
        return t('withdraw.status.approved');
      case 'rejected':
        return t('withdraw.status.rejected');
      default:
        return status;
    }
  };

  const selectedChain = CHAINS.find(c => c.name === chain);

  if (!isAuthenticated) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <PandaAlert severity="warning" message={t('withdraw.authRequired')} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          pt: 8,
          pb: 4,
          background: themeUtils.gradients.primary,
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
                background: themeUtils.gradients.primary,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                fontSize: { xs: '2.5rem', md: '3rem' },
              }}
            >
              {t('withdraw.title')}
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
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
                      {t('withdraw.form.title')}
                    </Typography>

                    {error && (
                      <PandaAlert severity="error" message={t('withdraw.error')} />
                    )}

                    {success && (
                      <PandaAlert severity="success" message={t('withdraw.success')} />
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                      <PandaInput
                        fullWidth
                        label={t('withdraw.form.amount')}
                        type="number"
                        value={amount}
                        onChange={setAmount}
                        required
                        sx={{ mb: 3 }}
                      />

                      <PandaSelect
                        fullWidth
                        label={t('withdraw.chain')}
                        value={chain}
                        options={[
                          { value: 'ethereum', label: 'Ethereum' },
                          { value: 'bsc', label: 'BSC' },
                          { value: 'polygon', label: 'Polygon' },
                        ]}
                        onChange={(value) => setChain(value)}
                        required
                        sx={{ mb: 3 }}
                      />

                      <PandaInput
                        fullWidth
                        label={t('withdraw.form.address')}
                        value={address}
                        onChange={setAddress}
                        required
                        sx={{ mb: 3 }}
                      />

                      {selectedChain && (
                        <Box sx={{ mb: 3 }}>
                          <Typography variant="body2" color="text.secondary">
                            {t('withdraw.form.minAmount')}: {selectedChain.minAmount} USDT
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {selectedChain.feeDescription}
                          </Typography>
                        </Box>
                      )}

                      <PandaButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        animate
                      >
                        {loading ? <PandaProgress size={24} value={loading ? 50 : 0} /> : t('withdraw.form.submit')}
                      </PandaButton>
                    </Box>
                  </PandaCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
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
                      {t('withdraw.records.title')}
                    </Typography>

                    <PandaTable
                      columns={[
                        { id: 'amount', label: t('withdraw.records.amount') },
                        { id: 'chain', label: t('withdraw.records.chain') },
                        { id: 'status', label: t('withdraw.records.status') },
                        { id: 'date', label: t('withdraw.records.date') }
                      ]}
                      data={records.map(record => ({
                        id: record.id,
                        amount: `${record.amount} USDT`,
                        chain: record.chain,
                        status: getStatusText(record.status),
                        date: new Date(record.createdAt).toLocaleDateString()
                      }))}
                    />
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

export default Withdraw; 