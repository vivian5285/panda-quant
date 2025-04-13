import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
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
  Divider
} from '@mui/material';
import {
  ContentCopy as CopyIcon,
  Share as ShareIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import axios from 'axios';
import { format } from 'date-fns';

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
          Referral Center
        </Typography>

        <Grid container spacing={3}>
          {/* 推荐链接卡片 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Referral Link
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  variant="body1"
                  sx={{
                    flex: 1,
                    p: 1,
                    bgcolor: theme.palette.grey[100],
                    borderRadius: 1,
                    wordBreak: 'break-all'
                  }}
                >
                  {referralLink}
                </Typography>
                <Tooltip title="Copy Link">
                  <IconButton onClick={handleCopyLink} color="primary">
                    <CopyIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                  <IconButton onClick={handleShare} color="primary">
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>

          {/* 统计卡片 */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                First Generation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Referrals
                      </Typography>
                      <Typography variant="h4">
                        {stats.firstGen.count}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon color="primary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Commission
                      </Typography>
                      <Typography variant="h4" color="primary">
                        ${stats.firstGen.totalCommission.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Second Generation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon color="secondary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Referrals
                      </Typography>
                      <Typography variant="h4">
                        {stats.secondGen.count}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <MoneyIcon color="secondary" />
                    <Box>
                      <Typography variant="subtitle2" color="text.secondary">
                        Commission
                      </Typography>
                      <Typography variant="h4" color="secondary">
                        ${stats.secondGen.totalCommission.toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* 推荐人列表 */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Referral History
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Level</TableCell>
                      <TableCell>Commission</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {referrals.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>{referral.name}</TableCell>
                        <TableCell>{referral.email}</TableCell>
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
                        <TableCell>
                          {format(new Date(referral.referredAt), 'MMM dd, yyyy')}
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

export default ReferralLink; 