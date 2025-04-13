import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BacktestConfig: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [config, setConfig] = useState({
    strategyName: '',
    riskLevel: '',
    symbol: 'BTC/USDT',
    timeframe: '1m',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    initialCapital: 10000,
  });

  const handleChange = (field: string) => (event: any) => {
    setConfig({
      ...config,
      [field]: event.target.value,
    });
  };

  const handleDateChange = (field: string) => (date: Date | null) => {
    if (date) {
      setConfig({
        ...config,
        [field]: date,
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/strategy/backtest/run', {
        ...config,
        startDate: config.startDate.toISOString(),
        endDate: config.endDate.toISOString(),
      });

      // 保存回测结果
      await axios.post('/api/strategy/backtest/save', {
        userId: 'current-user', // TODO: 从认证系统获取
        backtestResults: response.data,
      });

      // 导航到结果页面
      navigate('/backtest/results');
    } catch (err) {
      setError('Failed to run backtest');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Backtest Configuration
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* 策略选择 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Strategy</InputLabel>
                <Select
                  value={config.strategyName}
                  onChange={handleChange('strategyName')}
                  label="Strategy"
                  required
                >
                  <MenuItem value="Scalping">Scalping</MenuItem>
                  <MenuItem value="SuperTrend">SuperTrend</MenuItem>
                  <MenuItem value="Grid">Grid Trading</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 风险等级 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={config.riskLevel}
                  onChange={handleChange('riskLevel')}
                  label="Risk Level"
                  required
                >
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 交易对 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Symbol</InputLabel>
                <Select
                  value={config.symbol}
                  onChange={handleChange('symbol')}
                  label="Symbol"
                  required
                >
                  <MenuItem value="BTC/USDT">BTC/USDT</MenuItem>
                  <MenuItem value="ETH/USDT">ETH/USDT</MenuItem>
                  <MenuItem value="BNB/USDT">BNB/USDT</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 时间周期 */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Timeframe</InputLabel>
                <Select
                  value={config.timeframe}
                  onChange={handleChange('timeframe')}
                  label="Timeframe"
                  required
                >
                  <MenuItem value="1m">1 Minute</MenuItem>
                  <MenuItem value="5m">5 Minutes</MenuItem>
                  <MenuItem value="15m">15 Minutes</MenuItem>
                  <MenuItem value="1h">1 Hour</MenuItem>
                  <MenuItem value="4h">4 Hours</MenuItem>
                  <MenuItem value="1d">1 Day</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* 日期选择 */}
            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Start Date"
                  value={config.startDate}
                  onChange={handleDateChange('startDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12} md={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End Date"
                  value={config.endDate}
                  onChange={handleDateChange('endDate')}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>

            {/* 初始资金 */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Initial Capital"
                type="number"
                value={config.initialCapital}
                onChange={handleChange('initialCapital')}
                required
              />
            </Grid>

            {/* 错误提示 */}
            {error && (
              <Grid item xs={12}>
                <Alert severity="error">{error}</Alert>
              </Grid>
            )}

            {/* 提交按钮 */}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                fullWidth
              >
                {loading ? 'Running Backtest...' : 'Run Backtest'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default BacktestConfig; 