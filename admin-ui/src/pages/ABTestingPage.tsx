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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Science as ScienceIcon,
  Group as GroupIcon,
  Timeline as TimelineIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { themeUtils } from '../theme';

interface TestStrategy {
  id: string;
  name: string;
  description: string;
  versionA: string;
  versionB: string;
  testGroup: string[];
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  metrics: {
    successRate: number;
    profitRate: number;
    riskLevel: number;
    userSatisfaction: number;
  };
}

interface TestStrategyFormData {
  name: string;
  description: string;
  versionA: string;
  versionB: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
}

const ABTestingPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [strategies, setStrategies] = useState<TestStrategy[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<TestStrategyFormData>>({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/ab-testing/strategies');
      if (!response.ok) {
        throw new Error('Failed to fetch test data');
      }
      const data = await response.json();
      setStrategies(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error fetching test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = () => {
    setFormData({});
    setSelectedUsers([]);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/admin/ab-testing/strategies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          testGroup: selectedUsers,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create test strategy');
      }

      fetchTestData();
      handleCloseDialog();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/ab-testing/strategies/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete test strategy');
      }

      fetchTestData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error deleting strategy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: 'active' | 'completed' | 'paused') => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/ab-testing/strategies/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update test strategy status');
      }

      fetchTestData();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

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
            {t('abTesting.title')}
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
            {t('abTesting.subtitle')}
          </Typography>
        </motion.div>

        <Box sx={{ mb: 3 }}>
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
            <Tab icon={<ScienceIcon />} label={t('abTesting.activeTests')} />
            <Tab icon={<CheckCircleIcon />} label={t('abTesting.completedTests')} />
            <Tab icon={<TimelineIcon />} label={t('abTesting.metrics')} />
          </Tabs>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              bgcolor: '#00FFB8',
              '&:hover': {
                bgcolor: '#00E6A5',
              },
            }}
          >
            {t('abTesting.newTest')}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {strategies
            .filter((strategy) => {
              if (activeTab === 0) return strategy.status === 'active';
              if (activeTab === 1) return strategy.status === 'completed';
              return true;
            })
            .map((strategy) => (
              <Grid item xs={12} key={strategy.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
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
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          {strategy.name}
                        </Typography>
                        <Box>
                          <Chip
                            label={t(`abTesting.status.${strategy.status}`)}
                            color={
                              strategy.status === 'active' ? 'success' :
                              strategy.status === 'completed' ? 'primary' : 'warning'
                            }
                            sx={{ mr: 1 }}
                          />
                          <IconButton size="small" onClick={() => handleOpenDialog()}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete(strategy.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {strategy.description}
                      </Typography>
                      <Grid container spacing={2} sx={{ mb: 2 }}>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            {t('abTesting.versionA')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {strategy.versionA}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Typography variant="subtitle2" gutterBottom>
                            {t('abTesting.versionB')}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {strategy.versionB}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('abTesting.testGroup')}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {strategy.testGroup.map((user) => (
                            <Chip
                              key={user}
                              label={user}
                              size="small"
                              icon={<GroupIcon />}
                            />
                          ))}
                        </Box>
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          {t('abTesting.metrics')}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" display="block" gutterBottom>
                              {t('abTesting.successRate')}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={strategy.metrics.successRate}
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
                              {strategy.metrics.successRate}%
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" display="block" gutterBottom>
                              {t('abTesting.profitRate')}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={strategy.metrics.profitRate}
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
                              {strategy.metrics.profitRate}%
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" display="block" gutterBottom>
                              {t('abTesting.riskLevel')}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={strategy.metrics.riskLevel}
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
                              {strategy.metrics.riskLevel}%
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="caption" display="block" gutterBottom>
                              {t('abTesting.userSatisfaction')}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={strategy.metrics.userSatisfaction}
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
                              {strategy.metrics.userSatisfaction}%
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {strategy.startDate} - {strategy.endDate}
                        </Typography>
                        {strategy.status === 'active' && (
                          <Box>
                            <Button
                              size="small"
                              startIcon={<CheckCircleIcon />}
                              onClick={() => handleStatusChange(strategy.id, 'completed')}
                              sx={{ mr: 1 }}
                            >
                              {t('abTesting.completeTest')}
                            </Button>
                            <Button
                              size="small"
                              startIcon={<CancelIcon />}
                              onClick={() => handleStatusChange(strategy.id, 'paused')}
                            >
                              {t('abTesting.pauseTest')}
                            </Button>
                          </Box>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
        </Grid>

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t('abTesting.newTest')}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label={t('abTesting.name')}
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('abTesting.description')}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                multiline
                rows={4}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('abTesting.versionA')}
                value={formData.versionA || ''}
                onChange={(e) => setFormData({ ...formData, versionA: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label={t('abTesting.versionB')}
                value={formData.versionB || ''}
                onChange={(e) => setFormData({ ...formData, versionB: e.target.value })}
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('abTesting.testGroup')}</InputLabel>
                <Select
                  multiple
                  value={selectedUsers}
                  onChange={(e) => setSelectedUsers(e.target.value as string[])}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem value="user1">User 1</MenuItem>
                  <MenuItem value="user2">User 2</MenuItem>
                  <MenuItem value="user3">User 3</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label={t('abTesting.startDate')}
                type="date"
                value={formData.startDate || ''}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label={t('abTesting.endDate')}
                type="date"
                value={formData.endDate || ''}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: '#00FFB8',
                '&:hover': {
                  bgcolor: '#00E6A5',
                },
              }}
            >
              {t('common.save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default ABTestingPage; 