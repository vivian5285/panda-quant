import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface UserStatus {
  _id: string;
  email: string;
  status: 'active' | 'insufficient_balance' | 'suspended';
  balance: number;
  hostingFee: number;
  deductionCredit: number;
  lastDeductionDate: string;
  nextDeductionDate: string;
  lastLoginAt: string;
  rechargeCount: number;
  totalRechargeAmount: number;
  createdAt: string;
}

const UserStatusManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserStatus | null>(null);
  const [formData, setFormData] = useState({
    status: 'active',
    hostingFee: 0,
    deductionCredit: 0,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showRechargeHistory, setShowRechargeHistory] = useState(false);
  const [rechargeHistory, setRechargeHistory] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(`/api/admin/user-status?page=${page}`);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError(t('error.fetchingUsers'));
      setLoading(false);
    }
  };

  const fetchRechargeHistory = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/api/admin/users/${userId}/recharge-history`);
      setRechargeHistory(response.data);
      setShowRechargeHistory(true);
    } catch (err) {
      setError(t('error.fetchingRechargeHistory'));
    }
  };

  const handleOpenDialog = (user: UserStatus) => {
    setSelectedUser(user);
    setFormData({
      status: user.status,
      hostingFee: user.hostingFee,
      deductionCredit: user.deductionCredit,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    if (!selectedUser) return;

    try {
      await axiosInstance.put(`/api/admin/user-status/${selectedUser._id}`, formData);
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(t('error.savingUserStatus'));
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchUsers();
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

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h1">
            {t('userStatusManagement')}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            disabled={loading}
          >
            {t('refresh')}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('email')}</TableCell>
                    <TableCell>{t('status')}</TableCell>
                    <TableCell>{t('balance')}</TableCell>
                    <TableCell>{t('hostingFee')}</TableCell>
                    <TableCell>{t('deductionCredit')}</TableCell>
                    <TableCell>{t('lastLogin')}</TableCell>
                    <TableCell>{t('rechargeInfo')}</TableCell>
                    <TableCell>{t('actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user._id}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={t(`status.${user.status}`)}
                          color={getStatusColor(user.status)}
                        />
                      </TableCell>
                      <TableCell>{user.balance}</TableCell>
                      <TableCell>{user.hostingFee}</TableCell>
                      <TableCell>{user.deductionCredit}</TableCell>
                      <TableCell>
                        {format(new Date(user.lastLoginAt), 'PPpp', { locale: zhCN })}
                      </TableCell>
                      <TableCell>
                        {t('count')}: {user.rechargeCount}
                        <br />
                        {t('total')}: {user.totalRechargeAmount}
                      </TableCell>
                      <TableCell>
                        <Tooltip title={t('edit')}>
                          <IconButton onClick={() => handleOpenDialog(user)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('rechargeHistory')}>
                          <IconButton onClick={() => fetchRechargeHistory(user._id)}>
                            <HistoryIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          </>
        )}
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {t('editUserStatus')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Typography variant="subtitle1">
                {selectedUser?.email}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>{t('status')}</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label={t('status')}
                >
                  <MenuItem value="active">{t('status.active')}</MenuItem>
                  <MenuItem value="insufficient_balance">
                    {t('status.insufficient_balance')}
                  </MenuItem>
                  <MenuItem value="suspended">{t('status.suspended')}</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('hostingFee')}
                type="number"
                value={formData.hostingFee}
                onChange={(e) => setFormData({ ...formData, hostingFee: Number(e.target.value) })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('deductionCredit')}
                type="number"
                value={formData.deductionCredit}
                onChange={(e) => setFormData({ ...formData, deductionCredit: Number(e.target.value) })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('cancel')}</Button>
          <Button onClick={handleSubmit} variant="contained">
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showRechargeHistory}
        onClose={() => setShowRechargeHistory(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{t('rechargeHistory')}</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('amount')}</TableCell>
                  <TableCell>{t('status')}</TableCell>
                  <TableCell>{t('createdAt')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rechargeHistory.map((record: any) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.amount}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`rechargeStatus.${record.status}`)}
                        color={record.status === 'success' ? 'success' : 'error'}
                      />
                    </TableCell>
                    <TableCell>
                      {format(new Date(record.createdAt), 'PPpp', { locale: zhCN })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowRechargeHistory(false)}>
            {t('close')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserStatusManagement; 