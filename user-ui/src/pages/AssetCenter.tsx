import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { AddCircle as DepositIcon, AccountBalanceWallet as WithdrawIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AssetSummary {
  totalBalance: number;
  totalProfit: number;
  hostingFee: number;
  isNewUser: boolean;
  deposits: Array<{
    id: string;
    amount: number;
    chain: string;
    status: string;
    createdAt: string;
  }>;
  fees: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
  profitHistory: Array<{
    date: string;
    profit: number;
  }>;
}

const AssetCenter: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [assetSummary, setAssetSummary] = useState<AssetSummary | null>(null);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawChain, setWithdrawChain] = useState('BSC');
  const [withdrawAddress, setWithdrawAddress] = useState('');

  useEffect(() => {
    const fetchAssetSummary = async () => {
      try {
        const response = await fetch('/api/asset/summary');
        if (!response.ok) {
          throw new Error('获取资产信息失败');
        }
        const data = await response.json();
        setAssetSummary(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching asset summary:', err);
        setError('获取资产信息失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchAssetSummary();
  }, []);

  const handleWithdraw = async () => {
    try {
      const response = await fetch('/api/asset/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          chain: withdrawChain,
          address: withdrawAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('提现申请失败');
      }

      setWithdrawDialogOpen(false);
      // 刷新资产信息
      const data = await fetch('/api/asset/summary').then(res => res.json());
      setAssetSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '提现申请失败');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          资产中心
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<DepositIcon />}
            onClick={() => navigate('/deposit/create')}
          >
            充值
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<WithdrawIcon />}
            onClick={() => setWithdrawDialogOpen(true)}
          >
            提现
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总资产
              </Typography>
              <Typography variant="h4">
                {assetSummary?.totalBalance.toFixed(2)} USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总收益
              </Typography>
              <Typography variant="h4">
                {assetSummary?.totalProfit.toFixed(2)} USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                托管费
              </Typography>
              <Typography variant="h4">
                {assetSummary?.hostingFee.toFixed(2)} USDT
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                收益趋势
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={assetSummary?.profitHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="profit" stroke="#4CAF50" name="收益" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            充值记录
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>时间</TableCell>
                  <TableCell>链</TableCell>
                  <TableCell>金额</TableCell>
                  <TableCell>状态</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assetSummary?.deposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell>{new Date(deposit.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{deposit.chain}</TableCell>
                    <TableCell>{deposit.amount.toFixed(2)} USDT</TableCell>
                    <TableCell>{deposit.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            托管费记录
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>时间</TableCell>
                  <TableCell>金额</TableCell>
                  <TableCell>状态</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {assetSummary?.fees.map((fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{new Date(fee.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{fee.amount.toFixed(2)} USDT</TableCell>
                    <TableCell>{fee.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>

      <Dialog open={withdrawDialogOpen} onClose={() => setWithdrawDialogOpen(false)}>
        <DialogTitle>提现申请</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="提现金额"
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>选择链</InputLabel>
              <Select
                value={withdrawChain}
                label="选择链"
                onChange={(e) => setWithdrawChain(e.target.value)}
              >
                <MenuItem value="BSC">BSC</MenuItem>
                <MenuItem value="ARB">Arbitrum</MenuItem>
                <MenuItem value="TRC">TRON</MenuItem>
                <MenuItem value="OP">Optimism</MenuItem>
                <MenuItem value="SOL">Solana</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="提现地址"
              value={withdrawAddress}
              onChange={(e) => setWithdrawAddress(e.target.value)}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWithdrawDialogOpen(false)}>取消</Button>
          <Button onClick={handleWithdraw} variant="contained" color="primary">
            确认提现
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AssetCenter; 