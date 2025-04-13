import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import InfoIcon from '@mui/icons-material/Info';

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

const Withdraw: React.FC = () => {
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
        throw new Error('获取提现记录失败');
      }

      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '获取提现记录失败');
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
        throw new Error('提现请求失败');
      }

      setSuccess('提现请求已提交，请等待审核');
      setAmount('');
      setChain('');
      setAddress('');
      fetchWithdrawalRecords();
    } catch (err) {
      setError(err instanceof Error ? err.message : '提现请求失败');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '审核中';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已拒绝';
      default:
        return status;
    }
  };

  const selectedChain = CHAINS.find(c => c.name === chain);

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">请先登录以进行提现操作</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          提现
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                提现信息
              </Typography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="提现金额 (USDT)"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      helperText={
                        selectedChain
                          ? `最小提现金额: ${selectedChain.minAmount} USDT`
                          : '请选择提现网络'
                      }
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>提现网络</InputLabel>
                      <Select
                        value={chain}
                        label="提现网络"
                        onChange={(e) => setChain(e.target.value)}
                        required
                      >
                        {CHAINS.map((chain) => (
                          <MenuItem key={chain.name} value={chain.name}>
                            {chain.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="提现地址"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </Grid>
                  {selectedChain && (
                    <Grid item xs={12}>
                      <Alert severity="info">
                        网络手续费: {selectedChain.fee} USDT
                        <IconButton
                          size="small"
                          onClick={() => setShowFeeDialog(true)}
                          sx={{ ml: 1 }}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Alert>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : '提交提现'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                提现记录
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>日期</TableCell>
                      <TableCell>金额</TableCell>
                      <TableCell>网络</TableCell>
                      <TableCell>状态</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {records.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.createdAt).toLocaleString()}
                        </TableCell>
                        <TableCell>{record.amount} USDT</TableCell>
                        <TableCell>{record.chain}</TableCell>
                        <TableCell>
                          <Chip
                            label={getStatusText(record.status)}
                            color={getStatusColor(record.status) as any}
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

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        <Dialog open={showFeeDialog} onClose={() => setShowFeeDialog(false)}>
          <DialogTitle>网络手续费说明</DialogTitle>
          <DialogContent>
            {selectedChain && (
              <Typography>
                {selectedChain.feeDescription}
                <br />
                请注意：手续费将从您的提现金额中扣除。
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowFeeDialog(false)}>关闭</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Withdraw; 