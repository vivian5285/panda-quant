import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BacktestResult {
  id: number;
  strategy_name: string;
  symbol: string;
  timeframe: string;
  start_date: string;
  end_date: string;
  initial_capital: number;
  final_capital: number;
  total_profit: number;
  profit_percentage: number;
  monthly_return: number;
  max_drawdown: number;
  win_rate: number;
  total_trades: number;
  winning_trades: number;
  losing_trades: number;
  average_profit: number;
  average_loss: number;
  profit_factor: number;
  sharpe_ratio: number;
  sortino_ratio: number;
  trades: Trade[];
}

interface Trade {
  entry_time: string;
  exit_time: string;
  entry_price: number;
  exit_price: number;
  profit: number;
  type: string;
}

const BacktestResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    const fetchBacktestDetails = async () => {
      try {
        const response = await axios.get(`/api/strategy/backtest/details/${id}`);
        setResult(response.data);
      } catch (err) {
        setError('Failed to fetch backtest details');
        console.error('Error fetching backtest details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBacktestDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !result) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || 'No backtest results found'}</Alert>
      </Box>
    );
  }

  // 准备图表数据
  const chartData = {
    labels: result.trades.map(trade => new Date(trade.exit_time).toLocaleDateString()),
    datasets: [
      {
        label: 'Profit',
        data: result.trades.map(trade => trade.profit),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: 'Profit Over Time'
      }
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Backtest Results
      </Typography>

      <Grid container spacing={3}>
        {/* 策略信息 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Strategy Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2">Strategy</Typography>
                <Typography>{result.strategy_name}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2">Symbol</Typography>
                <Typography>{result.symbol}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2">Timeframe</Typography>
                <Typography>{result.timeframe}</Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="subtitle2">Period</Typography>
                <Typography>
                  {new Date(result.start_date).toLocaleDateString()} -{' '}
                  {new Date(result.end_date).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 性能指标 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Metrics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Total Profit</Typography>
                <Typography color={result.total_profit >= 0 ? 'success.main' : 'error.main'}>
                  {result.total_profit.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Monthly Return</Typography>
                <Typography color={result.monthly_return >= 0 ? 'success.main' : 'error.main'}>
                  {result.monthly_return.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Max Drawdown</Typography>
                <Typography color="error.main">
                  {result.max_drawdown.toFixed(2)}%
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Win Rate</Typography>
                <Typography>{result.win_rate.toFixed(2)}%</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Sharpe Ratio</Typography>
                <Typography>{result.sharpe_ratio.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Sortino Ratio</Typography>
                <Typography>{result.sortino_ratio.toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 交易统计 */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trade Statistics
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Total Trades</Typography>
                <Typography>{result.total_trades}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Winning Trades</Typography>
                <Typography color="success.main">{result.winning_trades}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Losing Trades</Typography>
                <Typography color="error.main">{result.losing_trades}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Profit Factor</Typography>
                <Typography>{result.profit_factor.toFixed(2)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Average Profit</Typography>
                <Typography color="success.main">
                  {result.average_profit.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2">Average Loss</Typography>
                <Typography color="error.main">
                  {result.average_loss.toFixed(2)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* 收益图表 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Profit Chart
            </Typography>
            <Box height={400}>
              <Line data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Grid>

        {/* 交易记录 */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Trade History
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Entry Time</TableCell>
                    <TableCell>Exit Time</TableCell>
                    <TableCell>Entry Price</TableCell>
                    <TableCell>Exit Price</TableCell>
                    <TableCell>Profit</TableCell>
                    <TableCell>Type</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.trades.map((trade, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {new Date(trade.entry_time).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {new Date(trade.exit_time).toLocaleString()}
                      </TableCell>
                      <TableCell>{trade.entry_price.toFixed(2)}</TableCell>
                      <TableCell>{trade.exit_price.toFixed(2)}</TableCell>
                      <TableCell
                        sx={{
                          color: trade.profit >= 0 ? 'success.main' : 'error.main'
                        }}
                      >
                        {trade.profit.toFixed(2)}
                      </TableCell>
                      <TableCell>{trade.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BacktestResults; 