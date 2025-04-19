import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Chip,
  Pagination,
  Container,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { getUserStatuses, updateUserStatus } from '../api/user';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Edit as EditIcon,
  Cancel as CancelIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface UserStatus {
  _id: string;
  email: string;
  status: 'active' | 'insufficient_balance' | 'suspended';
  balance: number;
  hostingFee: number;
  deductionCredit: number;
  lastLoginAt: Date;
  rechargeCount: number;
  totalRechargeAmount: number;
}

const UserStatusManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<UserStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUser, setEditingUser] = useState<UserStatus | null>(null);
  const [formData, setFormData] = useState<Partial<Omit<UserStatus, '_id'>>>({
    status: 'active',
  });
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUserStatuses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUserStatuses(page);
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUserStatuses();
  }, [fetchUserStatuses]);

  const handleOpenDialog = (user: UserStatus) => {
    setEditingUser(user);
    setFormData({
      status: user.status,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setFormData({
      status: 'active',
    });
  };

  const handleSubmit = async () => {
    if (!editingUser) return;

    try {
      await updateUserStatus(editingUser._id, formData);
      fetchUserStatuses();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#00FFB8';
      case 'insufficient_balance':
        return '#FFB800';
      case 'suspended':
        return '#FF4D4D';
      default:
        return '#666666';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon sx={{ color: '#00FFB8' }} />;
      case 'insufficient_balance':
        return <WarningIcon sx={{ color: '#FFB800' }} />;
      case 'suspended':
        return <CancelIcon sx={{ color: '#FF4D4D' }} />;
      default:
        return <CheckCircleIcon sx={{ color: '#666666' }} />;
    }
  };

  const handleStatusChange = (event: SelectChangeEvent<UserStatus['status']>) => {
    setFormData({ ...formData, status: event.target.value as UserStatus['status'] });
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress sx={{ color: '#00FFB8' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          py: 4,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.02) 0%, rgba(0, 0, 0, 0) 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#333333',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: 0,
                  width: '60px',
                  height: '4px',
                  background: 'linear-gradient(90deg, #00FFB8, transparent)',
                  borderRadius: '2px',
                },
              }}
            >
              {t('userStatus.title')}
            </Typography>
          </Box>
        </motion.div>

        {error && (
          <Card
            sx={{
              mb: 3,
              bgcolor: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.2)',
              borderRadius: 2,
            }}
          >
            <CardContent>
              <Typography color="error">{error}</Typography>
            </CardContent>
          </Card>
        )}

        <Paper
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 184, 0.1)',
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#00FFB8' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')} size="small">
                    <CloseIcon sx={{ color: '#666666' }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: '#00FFB8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00FFB8',
                },
              },
            }}
          />
        </Paper>

        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 255, 184, 0.1)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('email')}</TableCell>
                <TableCell>{t('status')}</TableCell>
                <TableCell>{t('balance')}</TableCell>
                <TableCell>{t('hostingFee')}</TableCell>
                <TableCell>{t('deductionCredit')}</TableCell>
                <TableCell>{t('lastLogin')}</TableCell>
                <TableCell>{t('recharge')}</TableCell>
                <TableCell>{t('actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#333333' }}>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(user.status)}
                      label={t(`userStatus.${user.status}`)}
                      sx={{
                        bgcolor: `${getStatusColor(user.status)}20`,
                        color: getStatusColor(user.status),
                        border: `1px solid ${getStatusColor(user.status)}`,
                        '& .MuiChip-icon': {
                          color: getStatusColor(user.status),
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#333333' }}>
                      {user.balance}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#333333' }}>
                      {user.hostingFee}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#333333' }}>
                      {user.deductionCredit}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#666666' }}>
                      {format(user.lastLoginAt, 'PPpp', { locale: zhCN })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: '#333333' }}>
                      {t('count')}: {user.rechargeCount}
                      <br />
                      {t('total')}: {user.totalRechargeAmount}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleOpenDialog(user)}
                      startIcon={<EditIcon />}
                      sx={{
                        bgcolor: '#00FFB8',
                        color: '#000000',
                        '&:hover': {
                          bgcolor: '#00CC93',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {t('edit')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            sx={{
              '& .MuiPaginationItem-root': {
                color: '#666666',
                '&.Mui-selected': {
                  bgcolor: '#00FFB8',
                  color: '#000000',
                  '&:hover': {
                    bgcolor: '#00CC93',
                  },
                },
              },
            }}
          />
        </Box>

        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
              background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 0, 0, 0) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 255, 184, 0.1)',
            },
          }}
        >
          <DialogTitle>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: '#333333',
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #00FFB8, transparent)',
                  borderRadius: '2px',
                },
              }}
            >
              {t('editUserStatus')}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: '#333333', fontWeight: 500 }}>
                  {editingUser?.email}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Select
                  value={formData.status}
                  onChange={handleStatusChange}
                  label={t('status')}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00FFB8',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00FFB8',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#00FFB8',
                    },
                  }}
                >
                  <MenuItem value="active">{t('userStatus.active')}</MenuItem>
                  <MenuItem value="insufficient_balance">{t('userStatus.insufficient_balance')}</MenuItem>
                  <MenuItem value="suspended">{t('userStatus.suspended')}</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseDialog}
              sx={{
                color: '#666666',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              {t('cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: '#00FFB8',
                color: '#000000',
                '&:hover': {
                  bgcolor: '#00CC93',
                },
              }}
            >
              {t('save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UserStatusManagement; 