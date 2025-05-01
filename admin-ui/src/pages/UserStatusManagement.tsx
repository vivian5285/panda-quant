import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip as MuiTooltip,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import {
  Container,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import theme from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';

interface UserStatus {
  id: string;
  userId: string;
  username: string;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  lastLogin: string;
  loginCount: number;
  lastActivity: string;
  ipAddress: string;
}

const UserStatusManagement: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [data, setData] = useState<UserStatus[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserStatus | null>(null);
  const [_searchTerm, setSearchTerm] = useState('');
  const [_statusFilter, setStatusFilter] = useState('all');
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedStatus, setEditedStatus] = useState<UserStatus['status']>('active');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Mock API call
      const mockUsers: UserStatus[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'John Doe',
          status: 'active',
          lastLogin: '2024-04-23T10:00:00Z',
          loginCount: 42,
          lastActivity: '2024-04-23T10:30:00Z',
          ipAddress: '192.168.1.1',
        },
        {
          id: '2',
          userId: 'user2',
          username: 'Jane Smith',
          status: 'inactive',
          lastLogin: '2024-04-22T15:00:00Z',
          loginCount: 18,
          lastActivity: '2024-04-22T15:30:00Z',
          ipAddress: '192.168.1.2',
        },
        {
          id: '3',
          userId: 'user3',
          username: 'Bob Johnson',
          status: 'suspended',
          lastLogin: '2024-04-21T09:00:00Z',
          loginCount: 5,
          lastActivity: '2024-04-21T09:30:00Z',
          ipAddress: '192.168.1.3',
        },
      ];
      setData(mockUsers);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const getStatusColor = (status: UserStatus['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.warning.main;
      case 'suspended':
        return theme.palette.error.main;
      case 'banned':
        return theme.palette.error.dark;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleEdit = (user: UserStatus) => {
    setSelectedUser(user);
    setEditedStatus(user.status);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (selectedUser) {
      const updatedUsers = data.map((user) =>
        user.id === selectedUser.id ? { ...user, status: editedStatus } : user
      );
      setData(updatedUsers);
      setOpenDialog(false);
      setSelectedUser(null);
    }
  };

  const renderUserCard = (user: UserStatus) => (
    <motion.div
      key={user.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {user.username}
            </Typography>
            <MuiTooltip title={t('userStatus.edit')}>
              <IconButton onClick={() => handleEdit(user)}>
                <EditIcon />
              </IconButton>
            </MuiTooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {user.userId}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('userStatus.status')}
              </Typography>
              <Chip
                label={t(`userStatus.${user.status}`)}
                sx={{
                  bgcolor: `${getStatusColor(user.status)}20`,
                  color: getStatusColor(user.status),
                  fontWeight: 500,
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('userStatus.loginCount')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {user.loginCount}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('userStatus.lastLogin')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(user.lastLogin).toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('userStatus.lastActivity')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(user.lastActivity).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t('userStatus.ipAddress')}: {user.ipAddress}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {data.map(renderUserCard)}
    </Box>
  );

  const renderActions = () => (
    <Button
      variant="contained"
      startIcon={<RefreshIcon />}
      onClick={fetchUsers}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        '&:hover': {
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
        },
      }}
    >
      {t('userStatus.refresh')}
    </Button>
  );

  return (
    <PageLayout
      title={t('userStatus.title')}
      actions={renderActions()}
      content={renderContent()}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('userStatus.editStatus')}</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedUser.username}
              </Typography>
              <FormControl fullWidth>
                <InputLabel>{t('userStatus.status')}</InputLabel>
                <Select
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value as UserStatus['status'])}
                  label={t('userStatus.status')}
                >
                  <MenuItem value="active">{t('userStatus.active')}</MenuItem>
                  <MenuItem value="inactive">{t('userStatus.inactive')}</MenuItem>
                  <MenuItem value="suspended">{t('userStatus.suspended')}</MenuItem>
                  <MenuItem value="banned">{t('userStatus.banned')}</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: `${theme.palette.text.secondary}10`,
              },
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default UserStatusManagement; 