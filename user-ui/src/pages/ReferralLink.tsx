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
  Chip,
  useTheme,
  IconButton,
  Tooltip,
  Button
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { GradientTitle } from '../components/common/GradientTitle';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { slideUp } from '../animations';

interface Referral {
  id: string;
  email: string;
  name: string;
  level: number;
  commission: number;
  status: string;
  createdAt: string;
  referredAt: string;
}

interface ReferralStats {
  firstGen: {
    count: number;
    totalCommission: number;
  };
  secondGen: {
    count: number;
    totalCommission: number;
  };
}

const ReferralLink: React.FC = () => {
  const theme = useTheme();
  const [referralLink, setReferralLink] = useState<string>('');
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState<ReferralStats>({
    firstGen: { count: 0, totalCommission: 0 },
    secondGen: { count: 0, totalCommission: 0 }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linkRes, referralsRes, statsRes] = await Promise.all([
        axios.get('/api/referral/referral-link'),
        axios.get('/api/referral/referrals'),
        axios.get('/api/referral/user-rewards')
      ]);

      setReferralLink(linkRes.data.referralLink);
      setReferrals(referralsRes.data);
      setStats(statsRes.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    // 可以添加复制成功的提示
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join Panda Trade',
        text: 'Join me on Panda Trade and start trading with AI!',
        url: referralLink
      });
    }
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
            title={t('referral.title', '推荐链接')} 
            variant="h2" 
            align="center" 
            sx={{ mb: 6 }}
          >
            {t('referral.title', '推荐链接')}
          </GradientTitle>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {t('referral.yourLink', '您的推荐链接')}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {referralLink}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCopyLink}
              >
                {t('referral.copy', '复制链接')}
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                {t('referral.howItWorks', '推荐奖励机制')}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {t('referral.description', '邀请好友注册并使用我们的服务，您和您的好友都将获得奖励。')}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {t('referral.reward', '每成功推荐一位好友，您将获得：')}
              </Typography>
              <ul>
                <li>{t('referral.reward1', '好友首笔交易金额的 10% 作为奖励')}</li>
                <li>{t('referral.reward2', '好友交易手续费的 20% 作为持续奖励')}</li>
              </ul>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ReferralLink; 