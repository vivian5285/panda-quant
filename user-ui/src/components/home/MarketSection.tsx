import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Tabs, Tab, Paper, Grid, IconButton, Tooltip } from '@mui/material';
import { Refresh as RefreshIcon, Info as InfoIcon } from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

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
      id={`market-tabpanel-${index}`}
      aria-labelledby={`market-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const MarketSection: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [cryptoData, setCryptoData] = useState<any>(null);
  const [forexData, setForexData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchMarketData = async () => {
    setLoading(true);
    try {
      // 模拟获取加密货币数据
      const cryptoChartData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
          {
            label: 'BTC/USDT',
            data: [30000, 32000, 35000, 38000, 40000, 42000],
            borderColor: '#00bfae',
            backgroundColor: 'rgba(0, 191, 174, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'ETH/USDT',
            data: [2000, 2200, 2400, 2600, 2800, 3000],
            borderColor: '#004d2d',
            backgroundColor: 'rgba(0, 77, 45, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      };

      // 模拟获取外汇数据
      const forexChartData = {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
          {
            label: 'EUR/USD',
            data: [1.08, 1.09, 1.10, 1.11, 1.12, 1.13],
            borderColor: '#00bfae',
            backgroundColor: 'rgba(0, 191, 174, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'GBP/USD',
            data: [1.25, 1.26, 1.27, 1.28, 1.29, 1.30],
            borderColor: '#004d2d',
            backgroundColor: 'rgba(0, 77, 45, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      };

      setCryptoData(cryptoChartData);
      setForexData(forexChartData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching market data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // 每30秒更新一次
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
  };

  return (
    <Box sx={{ py: 8, bgcolor: '#fff' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              color: '#004d2d',
            }}
          >
            市场行情
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              最后更新: {lastUpdated.toLocaleTimeString()}
            </Typography>
            <Tooltip title="刷新数据">
              <IconButton onClick={fetchMarketData} disabled={loading}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="数据来源: Binance API">
              <IconButton>
                <InfoIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="加密货币" />
            <Tab label="外汇市场" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box sx={{ height: 400, position: 'relative' }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography>加载中...</Typography>
                    </Box>
                  ) : (
                    <Line data={cryptoData} options={chartOptions} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ height: 400 }}>
                  <Bar
                    data={{
                      labels: ['BTC', 'ETH'],
                      datasets: [
                        {
                          label: '24h 交易量',
                          data: [1200000000, 800000000],
                          backgroundColor: ['#00bfae', '#004d2d'],
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      indexAxis: 'y' as const,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={8}>
                <Box sx={{ height: 400, position: 'relative' }}>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                      <Typography>加载中...</Typography>
                    </Box>
                  ) : (
                    <Line data={forexData} options={chartOptions} />
                  )}
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ height: 400 }}>
                  <Bar
                    data={{
                      labels: ['EUR/USD', 'GBP/USD'],
                      datasets: [
                        {
                          label: '24h 交易量',
                          data: [500000000, 300000000],
                          backgroundColor: ['#00bfae', '#004d2d'],
                        },
                      ],
                    }}
                    options={{
                      ...chartOptions,
                      indexAxis: 'y' as const,
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </TabPanel>
        </Paper>
      </Container>
    </Box>
  );
};

export default MarketSection; 