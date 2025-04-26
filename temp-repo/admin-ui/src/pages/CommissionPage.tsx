import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  TableSortLabel,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { Search as SearchIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { themeUtils } from '../theme';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  AccountBalance as AccountBalanceIcon,
  PendingActions as PendingActionsIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';

interface UserCommission {
  id: string;
  username: string;
  teamSize: number;
  directCommission: number;
  indirectCommission: number;
  totalCommission: number;
  lastUpdated: string;
}

interface CommissionStats {
  totalCommission: number;
  pendingCommission: number;
  trend: number;
  lastUpdated: string;
}

interface TrendData {
  date: string;
  direct: number;
  indirect: number;
  total: number;
}

type SortField = 'username' | 'teamSize' | 'directCommission' | 'indirectCommission' | 'totalCommission' | 'lastUpdated';
type SortOrder = 'asc' | 'desc';

const CommissionPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<UserCommission[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState<SortField>('totalCommission');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [timeRange, setTimeRange] = useState('month');
  const [stats, setStats] = useState<CommissionStats>({
    totalCommission: 0,
    pendingCommission: 0,
    trend: 0,
    lastUpdated: ''
  });

  useEffect(() => {
    fetchCommissionData();
  }, [searchTerm, sortField, sortOrder, page, timeRange]);

  const fetchCommissionData = async () => {
    try {
      const [usersResponse, trendResponse, statsResponse] = await Promise.all([
        fetch(`/api/admin/commission/users?search=${searchTerm}&sortField=${sortField}&sortOrder=${sortOrder}&page=${page}`),
        fetch(`/api/admin/commission/trend?range=${timeRange}`),
        fetch('/api/admin/commission/stats')
      ]);

      const usersData = await usersResponse.json();
      const trendData = await trendResponse.json();
      const statsData = await statsResponse.json();

      setUsers(usersData.users);
      setTotalPages(usersData.pagination.totalPages);
      setTrendData(trendData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching commission data:', error);
    }
  };

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setTimeRange(event.target.value as string);
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
            {t('commission.title')}
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
            {t('commission.subtitle')}
          </Typography>
        </motion.div>

        {/* 统计卡片 */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AccountBalanceIcon sx={{ color: '#00FFB8', mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {t('commission.totalCommission')}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#00FFB8', fontWeight: 700 }}>
                    ${stats.totalCommission}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PendingActionsIcon sx={{ color: '#00FFB8', mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {t('commission.pendingCommission')}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#00FFB8', fontWeight: 700 }}>
                    ${stats.pendingCommission}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TimelineIcon sx={{ color: '#00FFB8', mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {t('commission.trend')}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#00FFB8', fontWeight: 700 }}>
                    {stats.trend}%
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
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
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ScheduleIcon sx={{ color: '#00FFB8', mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {t('commission.lastUpdated')}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#00FFB8', fontWeight: 700 }}>
                    {stats.lastUpdated}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* 过滤选项 */}
        <Box
          sx={{
            mb: 3,
            display: 'flex',
            gap: 2,
            '& .MuiFormControl-root': {
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: 'rgba(0, 255, 184, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0, 255, 184, 0.4)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00FFB8',
                },
              },
            },
          }}
        >
          <FormControl>
            <InputLabel>{t('commission.timeRange')}</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label={t('commission.timeRange')}
            >
              <MenuItem value="week">{t('commission.week')}</MenuItem>
              <MenuItem value="month">{t('commission.month')}</MenuItem>
              <MenuItem value="quarter">{t('commission.quarter')}</MenuItem>
              <MenuItem value="year">{t('commission.year')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* 用户佣金列表 */}
        <TableContainer
          component={Paper}
          sx={{
            background: '#FFFFFF',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
            border: '1px solid rgba(0, 255, 184, 0.2)',
            borderRadius: '12px',
            '& .MuiTableHead-root': {
              '& .MuiTableRow-root': {
                '& .MuiTableCell-root': {
                  color: 'text.secondary',
                  fontWeight: 600,
                  borderBottom: '2px solid rgba(0, 255, 184, 0.2)',
                },
              },
            },
            '& .MuiTableBody-root': {
              '& .MuiTableRow-root': {
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 184, 0.05)',
                },
                '& .MuiTableCell-root': {
                  borderBottom: '1px solid rgba(0, 255, 184, 0.1)',
                },
              },
            },
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'username'}
                    direction={sortField === 'username' ? sortOrder : 'asc'}
                    onClick={() => handleSort('username')}
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-active': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    {t('commission.user')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'teamSize'}
                    direction={sortField === 'teamSize' ? sortOrder : 'asc'}
                    onClick={() => handleSort('teamSize')}
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-active': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    {t('commission.teamSize')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'directCommission'}
                    direction={sortField === 'directCommission' ? sortOrder : 'asc'}
                    onClick={() => handleSort('directCommission')}
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-active': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    {t('commission.direct')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'indirectCommission'}
                    direction={sortField === 'indirectCommission' ? sortOrder : 'asc'}
                    onClick={() => handleSort('indirectCommission')}
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-active': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    {t('commission.indirect')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'totalCommission'}
                    direction={sortField === 'totalCommission' ? sortOrder : 'asc'}
                    onClick={() => handleSort('totalCommission')}
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-active': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    {t('commission.total')}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortField === 'lastUpdated'}
                    direction={sortField === 'lastUpdated' ? sortOrder : 'asc'}
                    onClick={() => handleSort('lastUpdated')}
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-active': {
                        color: '#00FFB8',
                      },
                    }}
                  >
                    {t('commission.lastUpdated')}
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip label={user.teamSize} color="primary" size="small" />
                  </TableCell>
                  <TableCell>${user.directCommission}</TableCell>
                  <TableCell>${user.indirectCommission}</TableCell>
                  <TableCell>
                    <Typography variant="body1" color="primary">
                      ${user.totalCommission}
                    </Typography>
                  </TableCell>
                  <TableCell>{user.lastUpdated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* 分页 */}
        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'center',
            '& .MuiPagination-root': {
              '& .MuiPaginationItem-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  backgroundColor: '#00FFB8',
                  color: '#FFFFFF',
                  '&:hover': {
                    backgroundColor: '#00E6A5',
                  },
                },
              },
            },
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Container>
    </Box>
  );
};

export default CommissionPage; 