import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Chip,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface CommissionRecord {
  _id: string;
  fromUserId: {
    _id: string;
    username: string;
  };
  amount: number;
  level: number;
  status: 'pending' | 'paid';
  strategyId: {
    _id: string;
    name: string;
  };
  createdAt: string;
  paidAt?: string;
}

interface CommissionStats {
  total: number;
  pending: number;
  paid: number;
}

const UserCommissionView: React.FC = () => {
  const theme = useTheme();
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [stats, setStats] = useState<CommissionStats>({ total: 0, pending: 0, paid: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommissions();
    fetchStats();
  }, []);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/commissions/user/commissions');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Error fetching commissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/commissions/user/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching commission stats:', error);
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 1:
        return '一级推荐';
      case 2:
        return '二级推荐';
      default:
        return '未知';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        mb: 4
      }}>
        我的佣金
      </Typography>

      {/* 统计卡片 */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              boxShadow: 'none',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrendingUpIcon sx={{ 
                    color: theme.palette.primary.main,
                    mr: 1,
                    fontSize: 30
                  }} />
                  <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                    总佣金
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ 
                  color: theme.palette.primary.main,
                  fontWeight: 'bold'
                }}>
                  ${stats.total.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
              boxShadow: 'none',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PendingActionsIcon sx={{ 
                    color: theme.palette.warning.main,
                    mr: 1,
                    fontSize: 30
                  }} />
                  <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                    待支付佣金
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ 
                  color: theme.palette.warning.main,
                  fontWeight: 'bold'
                }}>
                  ${stats.pending.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
              boxShadow: 'none',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ 
                    color: theme.palette.success.main,
                    mr: 1,
                    fontSize: 30
                  }} />
                  <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                    已支付佣金
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ 
                  color: theme.palette.success.main,
                  fontWeight: 'bold'
                }}>
                  ${stats.paid.toFixed(2)}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>

      {/* 佣金记录表格 */}
      <Card sx={{ 
        background: theme.palette.background.paper,
        boxShadow: 'none',
        borderRadius: 2
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>时间</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>来源用户</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>策略</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>金额</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>类型</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>状态</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow 
                  key={record._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04)
                    }
                  }}
                >
                  <TableCell>
                    {format(new Date(record.createdAt), 'yyyy-MM-dd HH:mm:ss')}
                  </TableCell>
                  <TableCell>{record.fromUserId.username}</TableCell>
                  <TableCell>{record.strategyId.name}</TableCell>
                  <TableCell sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}>
                    ${record.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{getLevelLabel(record.level)}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status === 'pending' ? '待支付' : '已支付'}
                      color={record.status === 'pending' ? 'warning' : 'success'}
                      sx={{
                        borderRadius: 1,
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default UserCommissionView; 