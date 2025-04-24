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
  Tabs,
  Tab,
  Grid,
  TableSortLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Container,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { themeUtils } from '../theme';
import {
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Schedule as ScheduleIcon,
  Group as GroupIcon,
  AccountBalance as AccountBalanceIcon,
  PendingActions as PendingActionsIcon
} from '@mui/icons-material';

interface TeamMember {
  id: string;
  username: string;
  joinDate: string;
  level: number;
  totalCommission: number;
}

interface CommissionRecord {
  id: string;
  date: string;
  amount: number;
  type: 'direct' | 'indirect';
  sourceUser: string;
  status: 'pending' | 'completed';
}

type SortField = 'username' | 'joinDate' | 'level' | 'totalCommission';
type SortOrder = 'asc' | 'desc';

const TeamPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [commissionRecords, setCommissionRecords] = useState<CommissionRecord[]>([]);
  const [stats, setStats] = useState({
    totalMembers: 0,
    directMembers: 0,
    totalCommission: 0,
    pendingCommission: 0
  });

  // 排序状态
  const [sortField, setSortField] = useState<SortField>('username');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  
  // 过滤状态
  const [commissionType, setCommissionType] = useState<string>('all');
  const [commissionStatus, setCommissionStatus] = useState<string>('all');
  
  // 分页状态
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTeamData();
  }, [activeTab, sortField, sortOrder, commissionType, commissionStatus, page]);

  const fetchTeamData = async () => {
    try {
      if (activeTab === 0) {
        const response = await fetch(`/api/team/info?sortField=${sortField}&sortOrder=${sortOrder}&page=${page}`);
        const data = await response.json();
        setTeamMembers(data.members);
        setStats(data.stats);
        setTotalPages(data.pagination.totalPages);
      } else {
        const response = await fetch(
          `/api/team/commission?type=${commissionType}&status=${commissionStatus}&page=${page}`
        );
        const data = await response.json();
        setCommissionRecords(data.records);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching team data:', error);
    }
  };

  const handleSort = (field: SortField) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setPage(1);
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
            {t('team.title')}
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
            {t('team.subtitle')}
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
                    <PeopleIcon sx={{ color: '#00FFB8', mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {t('team.totalMembers')}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#00FFB8', fontWeight: 700 }}>
                    {stats.totalMembers}
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
                    <GroupIcon sx={{ color: '#00FFB8', mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {t('team.directMembers')}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#00FFB8', fontWeight: 700 }}>
                    {stats.directMembers}
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
                    <AccountBalanceIcon sx={{ color: '#00FFB8', mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {t('team.totalCommission')}
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
                    <PendingActionsIcon sx={{ color: '#00FFB8', mr: 1 }} />
                    <Typography variant="h6" color="text.secondary">
                      {t('team.pendingCommission')}
                    </Typography>
                  </Box>
                  <Typography variant="h4" sx={{ color: '#00FFB8', fontWeight: 700 }}>
                    ${stats.pendingCommission}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* 标签页 */}
        <Paper
          sx={{
            mb: 3,
            background: '#FFFFFF',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
            border: '1px solid rgba(0, 255, 184, 0.2)',
            borderRadius: '12px',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#00FFB8',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00FFB8',
              },
            }}
          >
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label={t('team.members')}
            />
            <Tab
              icon={<MoneyIcon />}
              iconPosition="start"
              label={t('team.commission')}
            />
          </Tabs>
        </Paper>

        {/* 过滤选项 */}
        {activeTab === 1 && (
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
              <InputLabel>{t('team.type')}</InputLabel>
              <Select
                value={commissionType}
                onChange={(e) => setCommissionType(e.target.value)}
                label={t('team.type')}
              >
                <MenuItem value="all">{t('team.all')}</MenuItem>
                <MenuItem value="direct">{t('team.direct')}</MenuItem>
                <MenuItem value="indirect">{t('team.indirect')}</MenuItem>
              </Select>
            </FormControl>
            <FormControl>
              <InputLabel>{t('team.status')}</InputLabel>
              <Select
                value={commissionStatus}
                onChange={(e) => setCommissionStatus(e.target.value)}
                label={t('team.status')}
              >
                <MenuItem value="all">{t('team.all')}</MenuItem>
                <MenuItem value="pending">{t('team.pending')}</MenuItem>
                <MenuItem value="completed">{t('team.completed')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )}

        {/* 团队成员列表 */}
        {activeTab === 0 && (
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
                      {t('team.member')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'joinDate'}
                      direction={sortField === 'joinDate' ? sortOrder : 'asc'}
                      onClick={() => handleSort('joinDate')}
                      sx={{
                        color: 'text.secondary',
                        '&.Mui-active': {
                          color: '#00FFB8',
                        },
                      }}
                    >
                      {t('team.joinDate')}
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={sortField === 'level'}
                      direction={sortField === 'level' ? sortOrder : 'asc'}
                      onClick={() => handleSort('level')}
                      sx={{
                        color: 'text.secondary',
                        '&.Mui-active': {
                          color: '#00FFB8',
                        },
                      }}
                    >
                      {t('team.level')}
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
                      {t('team.commission')}
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>{member.username}</TableCell>
                    <TableCell>{member.joinDate}</TableCell>
                    <TableCell>{member.level}</TableCell>
                    <TableCell>${member.totalCommission}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* 佣金记录列表 */}
        {activeTab === 1 && (
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
                  <TableCell>{t('team.date')}</TableCell>
                  <TableCell>{t('team.amount')}</TableCell>
                  <TableCell>{t('team.type')}</TableCell>
                  <TableCell>{t('team.source')}</TableCell>
                  <TableCell>{t('team.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {commissionRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>${record.amount}</TableCell>
                    <TableCell>{t(`team.${record.type}`)}</TableCell>
                    <TableCell>{record.sourceUser}</TableCell>
                    <TableCell>{t(`team.${record.status}`)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

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

export default TeamPage; 