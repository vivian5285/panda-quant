import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Refresh as RefreshIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error';
  source: string;
  message: string;
  details: string;
}

const LogsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      // TODO: Implement actual API call
      const mockLogs: LogEntry[] = [
        {
          id: '1',
          timestamp: '2024-03-20 10:30:45',
          level: 'info',
          source: 'System',
          message: 'System started successfully',
          details: 'All services are running normally',
        },
        {
          id: '2',
          timestamp: '2024-03-20 10:31:20',
          level: 'warning',
          source: 'API',
          message: 'High API request rate detected',
          details: 'Rate limit threshold reached',
        },
        {
          id: '3',
          timestamp: '2024-03-20 10:32:15',
          level: 'error',
          source: 'Database',
          message: 'Connection timeout',
          details: 'Failed to connect to database server',
        },
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return '#00FFB8';
      case 'warning':
        return '#FFA726';
      case 'error':
        return '#FF3B30';
      default:
        return '#666666';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesSource = sourceFilter === 'all' || log.source === sourceFilter;
    return matchesSearch && matchesLevel && matchesSource;
  });

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
            {t('logs.title')}
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
            {t('logs.subtitle')}
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          <Grid item xs={12}>
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
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder={t('logs.search')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth>
                        <InputLabel>{t('logs.level')}</InputLabel>
                        <Select
                          value={levelFilter}
                          onChange={(e) => setLevelFilter(e.target.value)}
                          label={t('logs.level')}
                        >
                          <MenuItem value="all">{t('logs.all')}</MenuItem>
                          <MenuItem value="info">Info</MenuItem>
                          <MenuItem value="warning">Warning</MenuItem>
                          <MenuItem value="error">Error</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth>
                        <InputLabel>{t('logs.source')}</InputLabel>
                        <Select
                          value={sourceFilter}
                          onChange={(e) => setSourceFilter(e.target.value)}
                          label={t('logs.source')}
                        >
                          <MenuItem value="all">{t('logs.all')}</MenuItem>
                          <MenuItem value="System">System</MenuItem>
                          <MenuItem value="API">API</MenuItem>
                          <MenuItem value="Database">Database</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <FormControl fullWidth>
                        <InputLabel>{t('logs.date')}</InputLabel>
                        <Select
                          value={dateFilter}
                          onChange={(e) => setDateFilter(e.target.value)}
                          label={t('logs.date')}
                        >
                          <MenuItem value="all">{t('logs.all')}</MenuItem>
                          <MenuItem value="today">Today</MenuItem>
                          <MenuItem value="week">This Week</MenuItem>
                          <MenuItem value="month">This Month</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={<RefreshIcon />}
                          onClick={fetchLogs}
                          sx={{
                            bgcolor: '#00FFB8',
                            color: '#000',
                            '&:hover': {
                              bgcolor: '#00E6A5',
                            },
                          }}
                        >
                          {t('logs.refresh')}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DownloadIcon />}
                          sx={{
                            borderColor: '#00FFB8',
                            color: '#00FFB8',
                            '&:hover': {
                              borderColor: '#00E6A5',
                              bgcolor: 'rgba(0, 255, 184, 0.04)',
                            },
                          }}
                        >
                          {t('logs.export')}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
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
                      <TableCell>{t('logs.timestamp')}</TableCell>
                      <TableCell>{t('logs.level')}</TableCell>
                      <TableCell>{t('logs.source')}</TableCell>
                      <TableCell>{t('logs.message')}</TableCell>
                      <TableCell>{t('logs.details')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{log.timestamp}</TableCell>
                        <TableCell>
                          <Chip
                            label={log.level}
                            size="small"
                            sx={{
                              bgcolor: getLevelColor(log.level),
                              color: '#000',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>{log.source}</TableCell>
                        <TableCell>{log.message}</TableCell>
                        <TableCell>{log.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LogsPage; 