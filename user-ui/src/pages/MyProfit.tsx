import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../hooks/useAuth';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ProfitData {
  monthlyReturn: number;
  historicalReturns: Array<{
    date: string;
    return: number;
  }>;
  backtestResults: Array<{
    strategy: string;
    period: string;
    return: number;
    sharpeRatio: number;
    maxDrawdown: number;
  }>;
  comparisonData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }>;
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profit-tabpanel-${index}`}
      aria-labelledby={`profit-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const MyProfit: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profitData, setProfitData] = useState<ProfitData | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('1m');

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const response = await fetch(`/api/user/profit-history?range=${timeRange}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('获取收益数据失败');
        }

        const data = await response.json();
        setProfitData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取收益数据失败');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfitData();
    }
  }, [isAuthenticated, timeRange]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">请先登录以查看收益信息</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!profitData) {
    return null;
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '收益趋势对比',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => `${value}%`,
        },
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          收益中心
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  月化收益
                </Typography>
                <Typography variant="h4" color="primary">
                  {profitData.monthlyReturn.toFixed(2)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="profit tabs"
                >
                  <Tab label="收益趋势" />
                  <Tab label="回测详情" />
                  <Tab label="收益对比" />
                </Tabs>
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>时间范围</InputLabel>
                  <Select
                    value={timeRange}
                    label="时间范围"
                    onChange={handleTimeRangeChange}
                  >
                    <MenuItem value="1w">最近一周</MenuItem>
                    <MenuItem value="1m">最近一月</MenuItem>
                    <MenuItem value="3m">最近三月</MenuItem>
                    <MenuItem value="6m">最近六月</MenuItem>
                    <MenuItem value="1y">最近一年</MenuItem>
                  </Select>
                </FormControl>
              </Box>

              <TabPanel value={tabValue} index={0}>
                <Box sx={{ height: 400 }}>
                  <Line options={chartOptions} data={profitData.comparisonData} />
                </Box>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>策略</TableCell>
                        <TableCell>周期</TableCell>
                        <TableCell>收益率</TableCell>
                        <TableCell>夏普比率</TableCell>
                        <TableCell>最大回撤</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {profitData.backtestResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.strategy}</TableCell>
                          <TableCell>{result.period}</TableCell>
                          <TableCell>{result.return.toFixed(2)}%</TableCell>
                          <TableCell>{result.sharpeRatio.toFixed(2)}</TableCell>
                          <TableCell>{result.maxDrawdown.toFixed(2)}%</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <Box sx={{ height: 400 }}>
                  <Line options={chartOptions} data={profitData.comparisonData} />
                </Box>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default MyProfit; 