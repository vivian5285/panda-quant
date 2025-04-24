import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface ChainInfo {
  chain: string;
  address: string;
  minAmount: number;
  fee: number;
}

const DepositCreate: React.FC = () => {
  const [selectedChain, setSelectedChain] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [chainInfo, setChainInfo] = useState<ChainInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchChainInfo = async () => {
      try {
        const response = await fetch('/api/asset/chain-addresses');
        if (!response.ok) {
          throw new Error('获取链信息失败');
        }
        const data = await response.json();
        setChainInfo(data);
        if (data.length > 0) {
          setSelectedChain(data[0].chain);
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching chain info:', err);
        setError('获取链信息失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };

    fetchChainInfo();
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleCopyAddress = () => {
    const selectedChainInfo = chainInfo.find(info => info.chain === selectedChain);
    if (selectedChainInfo) {
      navigator.clipboard.writeText(selectedChainInfo.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/asset/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chain: selectedChain,
          amount: parseFloat(amount),
        }),
      });

      if (!response.ok) {
        throw new Error('创建充值订单失败');
      }

      const data = await response.json();
      navigate('/deposit/confirm', { state: { paymentId: data.paymentId } });
    } catch (err) {
      console.error('Error creating deposit:', err);
      setError('创建充值订单失败，请稍后重试');
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
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const selectedChainInfo = chainInfo.find(info => info.chain === selectedChain);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        创建充值订单
      </Typography>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('payment.selectChain')}</InputLabel>
                <Select
                  value={selectedChain}
                  onChange={(e) => setSelectedChain(e.target.value)}
                  label={t('payment.selectChain')}
                >
                  {chainInfo.map((info) => (
                    <MenuItem key={info.chain} value={info.chain}>
                      {info.chain}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('payment.amount')}
                value={amount}
                onChange={handleAmountChange}
                type="text"
                inputProps={{
                  inputMode: 'decimal',
                  pattern: '[0-9]*\\.?[0-9]*'
                }}
              />
            </Grid>

            {selectedChainInfo && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    充值地址
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body1" sx={{ wordBreak: 'break-all' }}>
                      {selectedChainInfo.address}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleCopyAddress}
                    >
                      {copied ? '已复制' : '复制'}
                    </Button>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    注意事项
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      最小充值金额: {selectedChainInfo.minAmount} USDT
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      手续费: {selectedChainInfo.fee} USDT
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      请确保使用 {selectedChain} 网络进行转账
                    </Typography>
                  </Box>
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleSubmit}
                disabled={!amount || !selectedChain}
              >
                创建充值订单
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DepositCreate; 