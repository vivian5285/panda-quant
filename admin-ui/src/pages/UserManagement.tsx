import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Grid, Typography, Container, LinearProgress, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Chip, IconButton, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Avatar, Card, CardContent, InputAdornment, Tabs, Paper, Box, Tab } from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { getUsers, createUser, updateUser, deleteUser } from '../api/users';
import { theme } from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';
import UserList from '../components/user/UserList';
import UserForm from '../components/user/UserForm';
import UserLevelManager from '../components/user/UserLevelManager';
import BlacklistManager from '../components/user/BlacklistManager';

interface User {
  id: string;
  username: string;
  email: string;
  status: string;
  role: string;
  lastLogin: string;
  avatar?: string;
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
      id={`user-management-tabpanel-${index}`}
      aria-labelledby={`user-management-tab-${index}`}
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

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      // Mock API call
      const mockUsers: User[] = [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          status: 'active',
          role: 'user',
          lastLogin: '2023-01-01T12:00:00Z',
        },
        {
          id: '2',
          username: 'user2',
          email: 'user2@example.com',
          status: 'inactive',
          role: 'admin',
          lastLogin: '2023-01-02T12:00:00Z',
        },
      ];
      setUsers(mockUsers);
    } catch (err) {
      setError(t('userManagement.error'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddUser = () => {
    setSelectedUser(null);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
  };

  const handleDeleteUser = (user: User) => {
    // Handle delete
  };

  const handleViewDetails = (user: User) => {
    // Handle view details
  };

  const handleSubmit = (user: User) => {
    // Handle submit
  };

  const handleCancel = () => {
    setSelectedUser(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <PageLayout
      title={t('userManagement.title')}
      actions={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddUser}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            '&:hover': {
              background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            },
          }}
        >
          {t('userManagement.addUser')}
        </Button>
      }
      filters={
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <TextField
                  fullWidth
                  label={t('userManagement.search')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box>
                <FormControl fullWidth>
                  <InputLabel>{t('userManagement.status')}</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label={t('userManagement.status')}
                  >
                    <MenuItem value="all">{t('userManagement.all')}</MenuItem>
                    <MenuItem value="active">{t('userManagement.active')}</MenuItem>
                    <MenuItem value="inactive">{t('userManagement.inactive')}</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
        </Box>
      }
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="用户列表" />
            <Tab label="用户等级" />
            <Tab label="黑名单" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <UserList
              users={filteredUsers}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onViewDetails={handleViewDetails}
            />
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <UserLevelManager />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <BlacklistManager />
          </TabPanel>
        </Paper>
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        )}
      </Box>
    </PageLayout>
  );
};

export default UserManagement; 