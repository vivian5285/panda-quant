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
  alpha,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';

interface CommissionRecord {
  _id: string;
  userId: {
    _id: string;
    username: string;
  } | null;
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

const CommissionManager: React.FC = () => {
  const theme = useTheme();
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [stats, setStats] = useState<CommissionStats>({ total: 0, pending: 0, paid: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState<CommissionRecord | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null as Date | null,
    endDate: null as Date | null,
    status: '' as '' | 'pending' | 'paid',
    userId: ''
  });

  useEffect(() => {
    fetchCommissions();
    fetchStats();
  }, [filters]);

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.startDate) {
        queryParams.append('startDate', filters.startDate.toISOString());
      }
      if (filters.endDate) {
        queryParams.append('endDate', filters.endDate.toISOString());
      }
      if (filters.status) {
        queryParams.append('status', filters.status);
      }
      if (filters.userId) {
        queryParams.append('userId', filters.userId);
      }

      const response = await fetch(`/api/commissions/admin/commissions?${queryParams}`);
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
      const response = await fetch('/api/commissions/admin/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching commission stats:', error);
    }
  };

  const handleStatusChange = async (record: CommissionRecord, newStatus: 'pending' | 'paid') => {
    try {
      const response = await fetch(`/api/commissions/admin/commissions/${record._id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords(records.map(r => r._id === record._id ? updatedRecord : r));
        setDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating commission status:', error);
    }
  };

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0:
        return '平台佣金';
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
        佣金管理
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

      {/* 筛选器 */}
      <Card sx={{ 
        background: theme.palette.background.paper,
        boxShadow: 'none',
        borderRadius: 2,
        mb: 3
      }}>
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FilterListIcon sx={{ 
              color: theme.palette.primary.main,
              mr: 1
            }} />
            <Typography variant="h6" sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }}>
              筛选条件
            </Typography>
          </Box>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
                <DatePicker
                  label="开始日期"
                  value={filters.startDate}
                  onChange={(date) => setFilters({ ...filters, startDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhCN}>
                <DatePicker
                  label="结束日期"
                  value={filters.endDate}
                  onChange={(date) => setFilters({ ...filters, endDate: date })}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>状态</InputLabel>
                <Select
                  value={filters.status}
                  label="状态"
                  onChange={(e: SelectChangeEvent) => setFilters({ ...filters, status: e.target.value as any })}
                >
                  <MenuItem value="">全部</MenuItem>
                  <MenuItem value="pending">待支付</MenuItem>
                  <MenuItem value="paid">已支付</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="用户ID"
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>

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
                }}>用户</TableCell>
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
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>操作</TableCell>
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
                  <TableCell>
                    {record.userId ? record.userId.username : '平台'}
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
                  <TableCell>
                    {record.status === 'pending' && (
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => {
                          setSelectedRecord(record);
                          setDialogOpen(true);
                        }}
                        sx={{
                          borderRadius: 1,
                          textTransform: 'none',
                          fontWeight: 'bold'
                        }}
                      >
                        标记已支付
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* 确认对话框 */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: 'none'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: theme.palette.primary.main,
          fontWeight: 'bold'
        }}>
          确认支付
        </DialogTitle>
        <DialogContent>
          <Typography>
            确认将佣金标记为已支付？
          </Typography>
          {selectedRecord && (
            <Box sx={{ mt: 2 }}>
              <Typography>用户: {selectedRecord.userId?.username || '平台'}</Typography>
              <Typography>金额: ${selectedRecord.amount.toFixed(2)}</Typography>
              <Typography>类型: {getLevelLabel(selectedRecord.level)}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setDialogOpen(false)}
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => selectedRecord && handleStatusChange(selectedRecord, 'paid')}
            color="primary"
            variant="contained"
            sx={{
              borderRadius: 1,
              textTransform: 'none',
              fontWeight: 'bold'
            }}
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommissionManager; 