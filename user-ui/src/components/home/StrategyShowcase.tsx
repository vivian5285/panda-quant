import React, { useState } from 'react';
import { Box, Container, Typography, Tabs, Tab, Paper, Grid, IconButton, Tooltip, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
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
import { Info as InfoIcon, TrendingUp as TrendingUpIcon, TrendingDown as TrendingDownIcon } from '@mui/icons-material';

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
      id={`strategy-tabpanel-${index}`}
      aria-labelledby={`strategy-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const strategies = [
  {
    name: '低风险策略',
    description: '稳健型投资策略,适合保守型投资者',
    riskLevel: '低',
    expectedReturn: '5-10%',
    maxDrawdown: '3%',
    chartData: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '收益曲线',
          data: [100, 102, 105, 107, 108, 110],
          borderColor: '#00bfae',
          backgroundColor: 'rgba(0, 191, 174, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    details: {
      sharpeRatio: '2.5',
      winRate: '85%',
      avgTradeDuration: '2-3天',
      recommendedCapital: '$10,000+',
    },
  },
  {
    name: '中风险策略',
    description: '平衡型投资策略,适合稳健型投资者',
    riskLevel: '中',
    expectedReturn: '10-20%',
    maxDrawdown: '8%',
    chartData: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '收益曲线',
          data: [100, 105, 112, 115, 118, 120],
          borderColor: '#00bfae',
          backgroundColor: 'rgba(0, 191, 174, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    details: {
      sharpeRatio: '3.0',
      winRate: '80%',
      avgTradeDuration: '1-2天',
      recommendedCapital: '$5,000+',
    },
  },
  {
    name: '高风险策略',
    description: '进取型投资策略,适合激进型投资者',
    riskLevel: '高',
    expectedReturn: '20-30%',
    maxDrawdown: '15%',
    chartData: {
      labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
      datasets: [
        {
          label: '收益曲线',
          data: [100, 110, 115, 125, 130, 140],
          borderColor: '#00bfae',
          backgroundColor: 'rgba(0, 191, 174, 0.1)',
          tension: 0.4,
          fill: true,
        },
      ],
    },
    details: {
      sharpeRatio: '3.5',
      winRate: '75%',
      avgTradeDuration: '几小时',
      recommendedCapital: '$2,000+',
    },
  },
];

const StrategyShowcase: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleStrategyClick = (strategy: any) => {
    setSelectedStrategy(strategy);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
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
    <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: '#004d2d',
          }}
        >
          策略展示
        </Typography>

        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            {strategies.map((strategy, index) => (
              <Tab
                key={index}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {strategy.name}
                    <Chip
                      label={strategy.riskLevel}
                      size="small"
                      color={
                        strategy.riskLevel === '低'
                          ? 'success'
                          : strategy.riskLevel === '中'
                          ? 'warning'
                          : 'error'
                      }
                    />
                  </Box>
                }
              />
            ))}
          </Tabs>

          {strategies.map((strategy, index) => (
            <TabPanel key={index} value={tabValue} index={index}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                  <Box sx={{ height: 400, position: 'relative' }}>
                    <Line data={strategy.chartData} options={chartOptions} />
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      {strategy.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                      {strategy.description}
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        策略指标
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingUpIcon color="success" />
                            <Typography>预期收益: {strategy.expectedReturn}</Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendingDownIcon color="error" />
                            <Typography>最大回撤: {strategy.maxDrawdown}</Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleStrategyClick(strategy)}
                      startIcon={<InfoIcon />}
                    >
                      查看详情
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </TabPanel>
          ))}
        </Paper>

        <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          {selectedStrategy && (
            <>
              <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {selectedStrategy.name}
                  <Chip
                    label={selectedStrategy.riskLevel}
                    size="small"
                    color={
                      selectedStrategy.riskLevel === '低'
                        ? 'success'
                        : selectedStrategy.riskLevel === '中'
                        ? 'warning'
                        : 'error'
                    }
                  />
                </Box>
              </DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    策略详情
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        夏普比率
                      </Typography>
                      <Typography variant="body1">{selectedStrategy.details.sharpeRatio}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        胜率
                      </Typography>
                      <Typography variant="body1">{selectedStrategy.details.winRate}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        平均持仓时间
                      </Typography>
                      <Typography variant="body1">{selectedStrategy.details.avgTradeDuration}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        建议资金
                      </Typography>
                      <Typography variant="body1">{selectedStrategy.details.recommendedCapital}</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog}>关闭</Button>
                <Button variant="contained" color="primary">
                  立即参与
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default StrategyShowcase; 