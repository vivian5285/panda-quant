import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  IconButton,
  useTheme,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Refresh as RefreshIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Timeline as TimelineIcon,
  People as PeopleIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { themeUtils } from '../theme';

interface StrategyStatus {
  id: string;
  name: string;
  status: 'running' | 'paused' | 'error';
  users: number;
  successRate: number;
  profitRate: number;
  riskLevel: number;
  lastUpdated: string;
}

interface UserActivity {
  id: string;
  username: string;
  action: string;
  timestamp: string;
  details: string;
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkUsage: number;
  activeConnections: number;
}

const MonitoringPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [strategies, setStrategies] = useState<StrategyStatus[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpuUsage: 0,
    memoryUsage: 0,
    networkUsage: 0,
    activeConnections: 0
  });
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    fetchMonitoringData();
    const interval = setInterval(fetchMonitoringData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    try {
      const [strategiesResponse, activitiesResponse, metricsResponse] = await Promise.all([
        fetch('/api/admin/monitoring/strategies'),
        fetch('/api/admin/monitoring/activities'),
        fetch('/api/admin/monitoring/metrics')
      ]);

      const strategiesData = await strategiesResponse.json();
      const activitiesData = await activitiesResponse.json();
      const metricsData = await metricsResponse.json();

      setStrategies(strategiesData);
      setActivities(activitiesData);
      setMetrics(metricsData);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Error fetching monitoring data:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'running':
        return <CheckCircleIcon color="success" />;
      case 'paused':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.03) 0%, rgba(0, 0, 0, 0) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#00FFB8',
              fontWeight: 700,
              mb: 1,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            }}
          >
            {t('monitoring.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              mb: 3,
              fontSize: '0.9rem',
              opacity: 0.8,
            }}
          >
            {t('monitoring.subtitle')}
          </Typography>
        </motion.div>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#00FFB8',
              },
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#00FFB8',
                },
              },
            }}
          >
            <Tab icon={<TimelineIcon />} label={t('monitoring.strategies')} />
            <Tab icon={<PeopleIcon />} label={t('monitoring.activities')} />
            <Tab icon={<SettingsIcon />} label={t('monitoring.system')} />
          </Tabs>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
              {t('monitoring.lastUpdate')}: {lastUpdate}
            </Typography>
            <Tooltip title={t('monitoring.refresh')}>
              <IconButton onClick={fetchMonitoringData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            {strategies.map((strategy) => (
              <Grid item xs={12} sm={6} md={4} key={strategy.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#FFFFFF',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                      border: '1px solid rgba(0, 255, 184, 0.2)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          {strategy.name}
                        </Typography>
                        {getStatusIcon(strategy.status)}
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          {t('monitoring.users')}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={(strategy.users / 100) * 100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0, 255, 184, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#00FFB8',
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {strategy.users}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          {t('monitoring.successRate')}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={strategy.successRate}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0, 255, 184, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#00FFB8',
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {strategy.successRate}%
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          {t('monitoring.profitRate')}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={strategy.profitRate}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(0, 255, 184, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#00FFB8',
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {strategy.profitRate}%
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          {t('monitoring.riskLevel')}
                        </Typography>
                        <LinearProgress
                          variant="determinate"
                          value={strategy.riskLevel}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: 'rgba(255, 59, 48, 0.1)',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: '#FF3B30',
                            },
                          }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {strategy.riskLevel}%
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {t('monitoring.lastUpdated')}: {strategy.lastUpdated}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <TableContainer
            component={Paper}
            sx={{
              background: '#FFFFFF',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
              border: '1px solid rgba(0, 255, 184, 0.2)',
              borderRadius: '12px',
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('monitoring.user')}</TableCell>
                  <TableCell>{t('monitoring.action')}</TableCell>
                  <TableCell>{t('monitoring.details')}</TableCell>
                  <TableCell>{t('monitoring.timestamp')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{activity.username}</TableCell>
                    <TableCell>{activity.action}</TableCell>
                    <TableCell>{activity.details}</TableCell>
                    <TableCell>{activity.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.2)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('monitoring.cpuUsage')}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.cpuUsage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 255, 184, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#00FFB8',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {metrics.cpuUsage}%
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.2)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('monitoring.memoryUsage')}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.memoryUsage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 255, 184, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#00FFB8',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {metrics.memoryUsage}%
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.2)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('monitoring.networkUsage')}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={metrics.networkUsage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: 'rgba(0, 255, 184, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#00FFB8',
                        },
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {metrics.networkUsage}%
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#FFFFFF',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.2)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {t('monitoring.activeConnections')}
                    </Typography>
                    <Typography variant="h4" sx={{ color: '#00FFB8', fontWeight: 700 }}>
                      {metrics.activeConnections}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default MonitoringPage; 