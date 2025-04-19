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

interface Referral {
  id: string;
  referredId: string;
  commission: number;
  level: number;
  status: string;
  createdAt: string;
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
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('referral.rewards')}
        </Typography>

        <Grid container spacing={3}>
          {/* 推荐码卡片 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('referral.code')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h5">{referralCode}</Typography>
                <Button
                  variant="outlined"
                  startIcon={<CopyIcon />}
                  onClick={handleCopyCode}
                >
                  {t('referral.copy')}
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* 奖励统计卡片 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('referral.summary')}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('referral.totalRewards')}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    ${rewards.totalReward.toFixed(2)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="textSecondary">
                    {t('referral.commissionEarned')}
                  </Typography>
                  <Typography variant="h5" color="primary">
                    ${rewards.commissionEarned.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 推荐记录表格 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('referral.history')}
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('referral.date')}</TableCell>
                      <TableCell>{t('referral.level')}</TableCell>
                      <TableCell>{t('referral.commission')}</TableCell>
                      <TableCell>{t('referral.status')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rewards.referrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          {format(new Date(referral.createdAt), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`Level ${referral.level}`}
                            color={referral.level === 1 ? 'primary' : 'secondary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>${referral.commission.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={referral.status}
                            color={referral.status === 'paid' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default ReferralRewards; 