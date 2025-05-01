import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Search, FilterList, CheckCircle, Pending, Error } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/utils/api';
import { formatDate } from '@/utils/date';
import { formatCurrency } from '@/utils/currency';

interface DepositRecord {
  id: string;
  userId: string;
  username: string;
  chain: string;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  transactionHash: string;
  createdAt: string;
}

const DepositsPage: React.FC = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [deposits, setDeposits] = useState<DepositRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [chainFilter, setChainFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    failed: 0
  });

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/deposits', {
        params: {
          page,
          search: searchTerm,
          status: statusFilter !== 'all' ? statusFilter : undefined,
          chain: chainFilter !== 'all' ? chainFilter : undefined
        }
      });
      setDeposits(response.data.deposits);
      setTotalPages(response.data.totalPages);
      setStats(response.data.stats);
      setError('');
    } catch (err) {
      setError('获取充值记录失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [page, searchTerm, statusFilter, chainFilter]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.put(`/admin/deposits/${id}/status`, { status: newStatus });
      fetchDeposits();
    } catch (err) {
      setError('更新状态失败');
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'completed':
        return <Chip icon={<CheckCircle />} label="已完成" color="success" />;
      case 'pending':
        return <Chip icon={<Pending />} label="处理中" color="warning" />;
      case 'failed':
        return <Chip icon={<Error />} label="失败" color="error" />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          充值记录管理
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总充值
              </Typography>
              <Typography variant="h4">
                {formatCurrency(stats.total)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                待处理
              </Typography>
              <Typography variant="h4">
                {formatCurrency(stats.pending)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                已完成
              </Typography>
              <Typography variant="h4">
                {formatCurrency(stats.completed)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                失败
              </Typography>
              <Typography variant="h4">
                {formatCurrency(stats.failed)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索用户ID、用户名或交易哈希"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>状态</InputLabel>
          <Select
            value={statusFilter}
            label="状态"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="pending">处理中</MenuItem>
            <MenuItem value="completed">已完成</MenuItem>
            <MenuItem value="failed">失败</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>链</InputLabel>
          <Select
            value={chainFilter}
            label="链"
            onChange={(e) => setChainFilter(e.target.value)}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="OP">Optimism</MenuItem>
            <MenuItem value="MATIC">Polygon</MenuItem>
            <MenuItem value="TRX">Tron</MenuItem>
            <MenuItem value="BSC">BSC</MenuItem>
            <MenuItem value="ARB">Arbitrum</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>时间</TableCell>
              <TableCell>用户</TableCell>
              <TableCell>链</TableCell>
              <TableCell>金额</TableCell>
              <TableCell>状态</TableCell>
              <TableCell>交易哈希</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {deposits.map((deposit) => (
              <TableRow key={deposit.id}>
                <TableCell>{formatDate(deposit.createdAt)}</TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">{deposit.username}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {deposit.userId}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{deposit.chain}</TableCell>
                <TableCell>{formatCurrency(deposit.amount)}</TableCell>
                <TableCell>{getStatusChip(deposit.status)}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {deposit.transactionHash}
                  </Typography>
                </TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select
                      value={deposit.status}
                      onChange={(e) => handleStatusChange(deposit.id, e.target.value)}
                    >
                      <MenuItem value="pending">处理中</MenuItem>
                      <MenuItem value="completed">已完成</MenuItem>
                      <MenuItem value="failed">失败</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default DepositsPage; 