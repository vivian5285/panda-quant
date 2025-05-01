import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip
} from '@mui/material';
import { ContentCopy as CopyIcon } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { GradientTitle } from '../components/common/GradientTitle';
import { motion } from 'framer-motion';
import { slideUp } from '../animations';

interface Referral {
  id: string;
  referredId: string;
  commission: number;
  level: number;
  status: string;
  createdAt: string;
}

interface Reward {
  id: string;
  amount: number;
  type: string;
  status: string;
  date: string;
}

const ReferralRewards: React.FC = () => {
  const { t } = useTranslation();
  const [rewards, setRewards] = useState<{
    totalReward: number;
    commissionEarned: number;
    referrals: Referral[];
  }>({
    totalReward: 0,
    commissionEarned: 0,
    referrals: []
  });
  const [referralCode, setReferralCode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRewards();
    fetchReferralCode();
  }, []);

  const fetchRewards = async () => {
    try {
      const response = await axios.get('/api/referral/user-rewards');
      setRewards(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch rewards');
      setLoading(false);
    }
  };

  const fetchReferralCode = async () => {
    try {
      const response = await axios.get('/api/referral/referral-code');
      setReferralCode(response.data.referralCode);
    } catch (err) {
      console.error('Failed to fetch referral code:', err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    // 可以添加复制成功的提示
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div variants={slideUp}>
          <GradientTitle 
            title={t('referral.rewards', '推荐奖励')} 
            variant="h2" 
            align="center" 
            sx={{ mb: 6 }}
          >
            {t('referral.rewards', '推荐奖励')}
          </GradientTitle>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                {t('referral.rewardHistory', '奖励历史')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('referral.amount', '金额')}</TableCell>
                      <TableCell>{t('referral.type', '类型')}</TableCell>
                      <TableCell>{t('referral.status', '状态')}</TableCell>
                      <TableCell>{t('referral.date', '日期')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rewards.referrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>${referral.commission.toFixed(2)}</TableCell>
                        <TableCell>
                          {t(`referral.${referral.level === 1 ? 'first_trade' : 'commission'}`, referral.level === 1 ? 'first_trade' : 'commission')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={referral.status === 'paid' ? 'paid' : 'pending'}
                            color={referral.status === 'paid' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {format(new Date(referral.createdAt), 'yyyy-MM-dd')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ReferralRewards; 