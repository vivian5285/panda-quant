import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip
} from '@mui/material';
import { ContentCopy, QrCode, CheckCircle, Pending, Error } from '@mui/icons-material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';
import QRCode from 'qrcode.react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/utils/api';

interface ChainInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface DepositRecord {
  id: string;
  date: string;
  chain: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionHash: string;
}

const chains: ChainInfo[] = [
  {
    id: 'OP',
    name: 'Optimism (OP)',
    description: '基于以太坊的Layer 2，提供低交易费用',
    icon: '⚡'
  },
  {
    id: 'MATIC',
    name: 'Polygon (Matic)',
    description: 'Layer 2解决方案，以低费率和高速为特点',
    icon: '🔷'
  },
  {
    id: 'TRX',
    name: 'Tron (TRC-20)',
    description: '以快速且低成本的交易著称',
    icon: '🌊'
  },
  {
    id: 'BSC',
    name: 'Binance Smart Chain (BEP-20)',
    description: '提供快速和低费用的交易',
    icon: '🟡'
  },
  {
    id: 'ARB',
    name: 'Arbitrum (ARB)',
    description: '以太坊的Layer 2，具有低延迟和低手续费的优势',
    icon: '⚡'
  }
];

const DepositPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [depositAddress, setDepositAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [depositRecords, setDepositRecords] = useState<DepositRecord[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (user) {
      fetchDepositHistory();
    }
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [user]);

  const fetchDepositHistory = async () => {
    try {
      const response = await api.get('/deposit/getDepositHistory');
      setDepositRecords(response.data);
    } catch (err) {
      setError('获取充值历史失败');
    }
  };

  const handleChainChange = async (chainId: string) => {
    setSelectedChain(chainId);
    setIsLoading(true);
    try {
      const response = await api.get(`/deposit/getDepositAddress?chain=${chainId}`);
      setDepositAddress(response.data.address);
      setError('');
    } catch (err) {
      setError('获取充值地址失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(depositAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startPolling = (transactionHash: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await api.get(
          `/deposit/checkDepositStatus?transactionHash=${transactionHash}&chain=${selectedChain}`
        );
        if (response.data.status === 'completed') {
          clearInterval(interval);
          fetchDepositHistory();
        }
      } catch (err) {
        console.error('检查充值状态失败:', err);
      }
    }, 5000);
    setPollingInterval(interval);
  };

  const handleSubmit = async () => {
    if (!amount || !selectedChain) {
      setError('请填写完整信息');
      return;
    }

    setIsLoading(true);
    try {
      // 这里可以添加提交充值请求的逻辑
      // 例如：记录用户输入的金额，等待区块链确认
      setError('');
    } catch (err) {
      setError('提交充值请求失败');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle color="success" />;
      case 'pending':
        return <Pending color="warning" />;
      case 'failed':
        return <Error color="error" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <GradientTitle>
            USDT充值
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            支持多链充值，选择最适合您的充值方式
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <PandaCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  选择充值链
                </Typography>
                <Select
                  fullWidth
                  value={selectedChain}
                  onChange={(e) => handleChainChange(e.target.value)}
                  displayEmpty
                  sx={{ mb: 3 }}
                >
                  <MenuItem value="">
                    <em>请选择充值链</em>
                  </MenuItem>
                  {chains.map((chain) => (
                    <MenuItem key={chain.id} value={chain.id}>
                      {chain.icon} {chain.name}
                    </MenuItem>
                  ))}
                </Select>

                {selectedChain && (
                  <>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {chains.find(c => c.id === selectedChain)?.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        充值地址
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                          fullWidth
                          value={depositAddress}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <Tooltip title="复制地址">
                                  <IconButton onClick={copyToClipboard}>
                                    <ContentCopy />
                                  </IconButton>
                                </Tooltip>
                              </InputAdornment>
                            ),
                          }}
                        />
                        {copied && (
                          <Alert severity="success" sx={{ ml: 1 }}>
                            已复制
                          </Alert>
                        )}
                      </Box>
                    </Box>

                    <Box sx={{ mb: 3, textAlign: 'center' }}>
                      {depositAddress && (
                        <QRCode
                          value={depositAddress}
                          size={200}
                          level="H"
                          includeMargin
                        />
                      )}
                    </Box>

                    <TextField
                      fullWidth
                      label="充值金额"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      type="number"
                      InputProps={{
                        endAdornment: <InputAdornment position="end">USDT</InputAdornment>,
                      }}
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      onClick={handleSubmit}
                      disabled={isLoading || !amount}
                      sx={{ mt: 3 }}
                    >
                      {isLoading ? <CircularProgress size={24} /> : '确认充值'}
                    </Button>
                  </>
                )}
              </CardContent>
            </PandaCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <PandaCard>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  充值记录
                </Typography>
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>时间</TableCell>
                        <TableCell>链</TableCell>
                        <TableCell>金额</TableCell>
                        <TableCell>状态</TableCell>
                        <TableCell>交易哈希</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {depositRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                          <TableCell>{record.chain}</TableCell>
                          <TableCell>{record.amount} USDT</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              {getStatusIcon(record.status)}
                              {record.status}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {record.transactionHash}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </PandaCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default DepositPage; 