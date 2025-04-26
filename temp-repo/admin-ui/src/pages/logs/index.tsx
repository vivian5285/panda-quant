import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Search, Info, Warning, Error as ErrorIcon } from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/utils/api';
import { formatDate } from '@/utils/date';

interface LogEntry {
  id: string;
  level: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
  source: string;
  details?: string;
}

const LogsPage: React.FC = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    info: 0,
    warning: 0,
    error: 0
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/logs', {
        params: {
          page,
          search: searchTerm,
          level: levelFilter !== 'all' ? levelFilter : undefined,
          source: sourceFilter !== 'all' ? sourceFilter : undefined
        }
      });
      setLogs(response.data.logs);
      setTotalPages(response.data.totalPages);
      setStats(response.data.stats);
      setError('');
    } catch (err) {
      setError('获取日志失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, searchTerm, levelFilter, sourceFilter]);

  const getLevelChip = (level: string) => {
    switch (level) {
      case 'info':
        return <Chip icon={<Info />} label="信息" color="info" />;
      case 'warning':
        return <Chip icon={<Warning />} label="警告" color="warning" />;
      case 'error':
        return <Chip icon={<ErrorIcon />} label="错误" color="error" />;
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          系统日志
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                总日志数
              </Typography>
              <Typography variant="h4">
                {stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                信息
              </Typography>
              <Typography variant="h4">
                {stats.info}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                警告
              </Typography>
              <Typography variant="h4">
                {stats.warning}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                错误
              </Typography>
              <Typography variant="h4">
                {stats.error}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索日志内容"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>级别</InputLabel>
          <Select
            value={levelFilter}
            label="级别"
            onChange={(e) => setLevelFilter(e.target.value)}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="info">信息</MenuItem>
            <MenuItem value="warning">警告</MenuItem>
            <MenuItem value="error">错误</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>来源</InputLabel>
          <Select
            value={sourceFilter}
            label="来源"
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <MenuItem value="all">全部</MenuItem>
            <MenuItem value="api">API</MenuItem>
            <MenuItem value="database">数据库</MenuItem>
            <MenuItem value="blockchain">区块链</MenuItem>
            <MenuItem value="system">系统</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>时间</TableCell>
              <TableCell>级别</TableCell>
              <TableCell>来源</TableCell>
              <TableCell>消息</TableCell>
              <TableCell>详情</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{formatDate(log.timestamp)}</TableCell>
                <TableCell>{getLevelChip(log.level)}</TableCell>
                <TableCell>{log.source}</TableCell>
                <TableCell>
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {log.message}
                  </Typography>
                </TableCell>
                <TableCell>
                  {log.details && (
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 300,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {log.details}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Container>
  );
};

export default LogsPage; 