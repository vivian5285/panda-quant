import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Slider,
  Alert,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';

interface Portfolio {
  id: number;
  name: string;
  description: string;
  strategies: PortfolioStrategy[];
  performance: PortfolioPerformance;
}

interface PortfolioStrategy {
  id: number;
  name: string;
  weight: number;
  performance: StrategyPerformance;
}

interface StrategyPerformance {
  totalProfit: number;
  maxDrawdown: number;
  winRate: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
}

interface PortfolioPerformance {
  totalProfit: number;
  maxDrawdown: number;
  winRate: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
  correlation: number[][];
  dailyReturns: { date: string; return: number }[];
}

const PortfolioManager: React.FC = () => {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(null);
  const [newPortfolio, setNewPortfolio] = useState({ name: '', description: '' });
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      const response = await fetch('/api/portfolios');
      if (!response.ok) throw new Error('Failed to fetch portfolios');
      const data = await response.json();
      setPortfolios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePortfolio = async () => {
    try {
      const response = await fetch('/api/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPortfolio)
      });
      if (!response.ok) throw new Error('Failed to create portfolio');
      await fetchPortfolios();
      setOpenDialog(false);
      setNewPortfolio({ name: '', description: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleUpdateStrategyWeight = async (portfolioId: number, strategyId: number, weight: number) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}/strategies/${strategyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight })
      });
      if (!response.ok) throw new Error('Failed to update strategy weight');
      await fetchPortfolios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeletePortfolio = async (portfolioId: number) => {
    try {
      const response = await fetch(`/api/portfolios/${portfolioId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete portfolio');
      await fetchPortfolios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">策略组合管理</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          创建新组合
        </Button>
      </Box>

      <Grid container spacing={3}>
        {portfolios.map((portfolio) => (
          <Grid item xs={12} key={portfolio.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">{portfolio.name}</Typography>
                  <Box>
                    <IconButton onClick={() => setSelectedPortfolio(portfolio)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeletePortfolio(portfolio.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  {portfolio.description}
                </Typography>

                <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                  <Tab label="策略配置" />
                  <Tab label="绩效分析" />
                  <Tab label="风险指标" />
                </Tabs>

                {tabValue === 0 && (
                  <TableContainer component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>策略名称</TableCell>
                          <TableCell>权重</TableCell>
                          <TableCell>总收益</TableCell>
                          <TableCell>最大回撤</TableCell>
                          <TableCell>胜率</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {portfolio.strategies.map((strategy) => (
                          <TableRow key={strategy.id}>
                            <TableCell>{strategy.name}</TableCell>
                            <TableCell>
                              <Slider
                                value={strategy.weight}
                                onChange={(_, value) => handleUpdateStrategyWeight(portfolio.id, strategy.id, value as number)}
                                step={0.01}
                                min={0}
                                max={1}
                                valueLabelDisplay="auto"
                              />
                            </TableCell>
                            <TableCell>{strategy.performance.totalProfit.toFixed(2)}%</TableCell>
                            <TableCell>{strategy.performance.maxDrawdown.toFixed(2)}%</TableCell>
                            <TableCell>{strategy.performance.winRate.toFixed(2)}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}

                {tabValue === 1 && (
                  <Box height={400}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={portfolio.performance.dailyReturns}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="return" stroke="#8884d8" name="日收益率" />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>风险指标</Typography>
                          <Typography>夏普比率: {portfolio.performance.sharpeRatio.toFixed(2)}</Typography>
                          <Typography>索提诺比率: {portfolio.performance.sortinoRatio.toFixed(2)}</Typography>
                          <Typography>波动率: {portfolio.performance.volatility.toFixed(2)}%</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>相关性矩阵</Typography>
                          <TableContainer>
                            <Table size="small">
                              <TableBody>
                                {portfolio.performance.correlation.map((row, i) => (
                                  <TableRow key={i}>
                                    {row.map((value, j) => (
                                      <TableCell key={j}>{value.toFixed(2)}</TableCell>
                                    ))}
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>创建新策略组合</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="组合名称"
            fullWidth
            value={newPortfolio.name}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="描述"
            fullWidth
            multiline
            rows={4}
            value={newPortfolio.description}
            onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleCreatePortfolio} color="primary">创建</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PortfolioManager; 