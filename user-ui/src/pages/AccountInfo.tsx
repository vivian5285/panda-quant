import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface AccountInfo {
  balance: number;
  hostingFee: number;
  status: 'active' | 'insufficient_balance' | 'suspended';
  referralCode: string;
  referralRewards: number;
  commissionHistory: Array<{
    date: string;
    amount: number;
    type: 'direct' | 'indirect';
    fromUser: string;
  }>;
  balanceHistory: Array<{
    date: string;
    amount: number;
    type: 'deposit' | 'withdrawal' | 'hosting_fee' | 'commission';
    description: string;
  }>;
  hostingFeeHistory: Array<{
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
  }>;
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
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
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

const AccountInfo: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [accountInfo, setAccountInfo] = useState<AccountInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch('/api/user/account-info', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('获取账户信息失败');
        }

        const data = await response.json();
        setAccountInfo(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取账户信息失败');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchAccountInfo();
    }
  }, [isAuthenticated]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'insufficient_balance':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '正常';
      case 'insufficient_balance':
        return '余额不足';
      case 'suspended':
        return '已暂停';
      default:
        return status;
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">请先登录以查看账户信息</Alert>
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

  if (!accountInfo) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          账户中心
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                账户余额
              </Typography>
              <Typography variant="h4" color="primary">
                ${accountInfo.balance.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                托管费用：${accountInfo.hostingFee.toFixed(2)}/周
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                账户状态
              </Typography>
              <Chip
                label={getStatusText(accountInfo.status)}
                color={getStatusColor(accountInfo.status) as any}
                sx={{ mt: 1 }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                推荐奖励
              </Typography>
              <Typography variant="h4" color="primary">
                ${accountInfo.referralRewards.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                推荐码：{accountInfo.referralCode}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="account tabs"
              >
                <Tab label="余额变动" />
                <Tab label="托管费用" />
                <Tab label="推荐奖励" />
              </Tabs>

              <TabPanel value={tabValue} index={0}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>日期</TableCell>
                        <TableCell>类型</TableCell>
                        <TableCell>金额</TableCell>
                        <TableCell>说明</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accountInfo.balanceHistory.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                          <TableCell>{record.type}</TableCell>
                          <TableCell>${record.amount.toFixed(2)}</TableCell>
                          <TableCell>{record.description}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={tabValue} index={1}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>日期</TableCell>
                        <TableCell>金额</TableCell>
                        <TableCell>状态</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accountInfo.hostingFeeHistory.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                          <TableCell>${record.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Chip
                              label={record.status}
                              color={record.status === 'paid' ? 'success' : record.status === 'pending' ? 'warning' : 'error'}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>

              <TabPanel value={tabValue} index={2}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>日期</TableCell>
                        <TableCell>类型</TableCell>
                        <TableCell>金额</TableCell>
                        <TableCell>来源用户</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {accountInfo.commissionHistory.map((record, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(record.date).toLocaleString()}</TableCell>
                          <TableCell>{record.type === 'direct' ? '直接推荐' : '间接推荐'}</TableCell>
                          <TableCell>${record.amount.toFixed(2)}</TableCell>
                          <TableCell>{record.fromUser}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AccountInfo; 