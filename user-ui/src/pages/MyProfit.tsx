import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { themeUtils } from '../theme';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaSelect from '../components/common/PandaSelect';
import PandaAlert from '../components/common/PandaAlert';
import PandaProgress from '../components/common/PandaProgress';
import PandaTable from '../components/common/PandaTable';
import Layout from '../components/Layout';

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

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const MyProfit: React.FC = () => {
  const { t } = useTranslation();
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
          throw new Error(t('profit.errors.fetchFailed'));
        }

        const data = await response.json();
        setProfitData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('profit.errors.fetchFailed'));
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProfitData();
    }
  }, [isAuthenticated, timeRange, t]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(event.target.value);
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <PandaAlert severity="warning">{t('profit.authRequired')}</PandaAlert>
        </Box>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px' 
        }}>
          <PandaProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box sx={{ p: 3 }}>
          <PandaAlert severity="error">{error}</PandaAlert>
        </Box>
      </Layout>
    );
  }

  if (!profitData) {
    return null;
  }

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: t('profit.chart.title'),
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: string | number) => {
            if (typeof value === 'number') {
              return `${value.toFixed(2)}%`;
            }
            return value;
          }
        },
      },
    },
  };

  return (
    <Layout>
      <Box
        sx={{
          minHeight: '100vh',
          pt: 8,
          pb: 4,
          background: themeUtils.createGradient('background.default', 'background.paper'),
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("/background-pattern.png")',
            opacity: 0.1,
            zIndex: 0,
          },
        }}
      >
        <Box
          sx={{
            maxWidth: 'lg',
            mx: 'auto',
            px: 3,
          }}
        >
          <motion.div {...fadeInUp}>
            <Typography
              variant="h2"
              sx={{
                mb: 6,
                fontWeight: 700,
                background: themeUtils.createGradient('primary'),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center',
                fontSize: { xs: '2.5rem', md: '3rem' },
              }}
            >
              {t('profit.title')}
            </Typography>

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main',
                        }}
                      >
                        {t('profit.monthly.title')}
                      </Typography>
                      <PandaSelect
                        value={timeRange}
                        onChange={handleTimeRangeChange}
                        sx={{ minWidth: 120 }}
                      >
                        <option value="1m">{t('profit.timeRange.1m')}</option>
                        <option value="3m">{t('profit.timeRange.3m')}</option>
                        <option value="6m">{t('profit.timeRange.6m')}</option>
                        <option value="1y">{t('profit.timeRange.1y')}</option>
                      </PandaSelect>
                    </Box>

                    <Line options={chartOptions} data={profitData.comparisonData} />
                  </PandaCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      {t('profit.backtest.title')}
                    </Typography>

                    <PandaTable>
                      <thead>
                        <tr>
                          <th>{t('profit.backtest.strategy')}</th>
                          <th>{t('profit.backtest.period')}</th>
                          <th>{t('profit.backtest.return')}</th>
                          <th>{t('profit.backtest.sharpe')}</th>
                          <th>{t('profit.backtest.drawdown')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profitData.backtestResults.map((result, index) => (
                          <tr key={index}>
                            <td>{result.strategy}</td>
                            <td>{result.period}</td>
                            <td>{result.return.toFixed(2)}%</td>
                            <td>{result.sharpeRatio.toFixed(2)}</td>
                            <td>{result.maxDrawdown.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </PandaTable>
                  </PandaCard>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={6}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <PandaCard
                    sx={{
                      height: '100%',
                      p: 4,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 2,
                        fontWeight: 600,
                        color: 'primary.main',
                      }}
                    >
                      {t('profit.history.title')}
                    </Typography>

                    <PandaTable>
                      <thead>
                        <tr>
                          <th>{t('profit.history.date')}</th>
                          <th>{t('profit.history.return')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profitData.historicalReturns.map((record, index) => (
                          <tr key={index}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>{record.return.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </PandaTable>
                  </PandaCard>
                </motion.div>
              </Grid>
            </Grid>
          </motion.div>
        </Box>
      </Box>
    </Layout>
  );
};

export default MyProfit; 