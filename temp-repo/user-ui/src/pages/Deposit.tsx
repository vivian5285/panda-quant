import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const DepositConfirm: React.FC = () => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<string>('');
  const [chain, setChain] = useState<string>('BSC');
  const [txHash, setTxHash] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await axios.post(`/api/asset/deposits/${userId}/confirm`, {
        amount: parseFloat(amount),
        chain,
        txHash
      });

      setSuccess('Deposit confirmed successfully!');
      setTimeout(() => {
        navigate('/asset-center');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          确认充值
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('deposit.amount')}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('deposit.selectChain')}</InputLabel>
                <Select
                  value={chain}
                  label={t('deposit.selectChain')}
                  onChange={(e) => setChain(e.target.value)}
                  required
                >
                  <MenuItem value="BSC">BSC</MenuItem>
                  <MenuItem value="ARB">Arbitrum</MenuItem>
                  <MenuItem value="TRC">TRON</MenuItem>
                  <MenuItem value="OP">Optimism</MenuItem>
                  <MenuItem value="SOL">Solana</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('deposit.txHash')}
                value={txHash}
                onChange={(e) => setTxHash(e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : '确认充值'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default DepositConfirm; 