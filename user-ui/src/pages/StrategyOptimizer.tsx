import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../hooks/useAuth';

interface Strategy {
  id: number;
  name: string;
  description: string;
  parameters: Parameter[];
  optimizationResults: OptimizationResult[];
}

interface Parameter {
  name: string;
  min: number;
  max: number;
  step: number;
  value: number;
}

interface OptimizationResult {
  id: number;
  params: Record<string, number>;
  totalProfit: number;
  maxDrawdown: number;
  winRate: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
}

const StrategyOptimizer: React.FC = () => {
  const { user } = useAuth();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      const response = await fetch('/api/strategies');
      if (!response.ok) throw new Error('Failed to fetch strategies');
      const data = await response.json();
      setStrategies(data);
      if (data.length > 0) {
        setSelectedStrategy(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleParameterChange = (paramName: string, value: number) => {
    if (!selectedStrategy) return;
    const updatedStrategy = {
      ...selectedStrategy,
      parameters: selectedStrategy.parameters.map(param =>
        param.name === paramName ? { ...param, value } : param
      )
    };
    setSelectedStrategy(updatedStrategy);
  };

  const handleOptimize = async () => {
    if (!selectedStrategy) return;
    setOptimizing(true);
    try {
      const response = await fetch('/api/strategies/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategyId: selectedStrategy.id,
          parameters: selectedStrategy.parameters.reduce((acc, param) => ({
            ...acc,
            [param.name]: param.value
          }), {})
        })
      });
      if (!response.ok) throw new Error('Failed to optimize strategy');
      const result = await response.json();
      const updatedStrategy = {
        ...selectedStrategy,
        optimizationResults: [...selectedStrategy.optimizationResults, result]
      };
      setSelectedStrategy(updatedStrategy);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setOptimizing(false);
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

  if (!selectedStrategy) {
    return (
      <Box p={3}>
        <Alert severity="info">请选择一个策略进行优化</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">策略参数优化</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOptimize}
          disabled={optimizing}
        >
          {optimizing ? '优化中...' : '开始优化'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedStrategy.name}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {selectedStrategy.description}
              </Typography>
              <Box mt={2}>
                {selectedStrategy.parameters.map((param) => (
                  <Box key={param.name} mb={2}>
                    <Typography gutterBottom>
                      {param.name}: {param.value}
                    </Typography>
                    <Slider
                      value={param.value}
                      onChange={(_, value) => handleParameterChange(param.name, value as number)}
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
                <Tab label="优化结果" />
                <Tab label="参数分布" />
                <Tab label="绩效对比" />
              </Tabs>

              {tabValue === 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>参数组合</TableCell>
                        <TableCell>总收益</TableCell>
                        <TableCell>最大回撤</TableCell>
                        <TableCell>胜率</TableCell>
                        <TableCell>夏普比率</TableCell>
                        <TableCell>索提诺比率</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedStrategy.optimizationResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell>
                            {Object.entries(result.params).map(([key, value]) => (
                              <Typography key={key} variant="body2">
                                {key}: {value}
                              </Typography>
                            ))}
                          </TableCell>
                          <TableCell>{result.totalProfit.toFixed(2)}%</TableCell>
                          <TableCell>{result.maxDrawdown.toFixed(2)}%</TableCell>
                          <TableCell>{result.winRate.toFixed(2)}%</TableCell>
                          <TableCell>{result.sharpeRatio.toFixed(2)}</TableCell>
                          <TableCell>{result.sortinoRatio.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}

              {tabValue === 1 && (
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="totalProfit" name="总收益" />
                      <YAxis type="number" dataKey="maxDrawdown" name="最大回撤" />
                      <ZAxis type="number" dataKey="sharpeRatio" name="夏普比率" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter
                        name="优化结果"
                        data={selectedStrategy.optimizationResults}
                        fill="#8884d8"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {tabValue === 2 && (
                <Box height={400}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid />
                      <XAxis type="number" dataKey="sharpeRatio" name="夏普比率" />
                      <YAxis type="number" dataKey="sortinoRatio" name="索提诺比率" />
                      <ZAxis type="number" dataKey="volatility" name="波动率" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter
                        name="风险收益"
                        data={selectedStrategy.optimizationResults}
                        fill="#82ca9d"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StrategyOptimizer; 