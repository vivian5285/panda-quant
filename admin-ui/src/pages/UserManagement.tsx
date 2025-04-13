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
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridValueGetterParams,
} from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import axiosInstance from '../utils/axiosInstance';
import { useTranslation } from 'react-i18next';

interface User {
  _id: string;
  email: string;
  balance: number;
  status: 'active' | 'insufficient_balance' | 'suspended';
  deductionCredit: number;
  createdAt: string;
  updatedAt: string;
}

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    balance: 0,
    status: 'active',
    deductionCredit: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/api/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError(t('error.fetchingUsers'));
      setLoading(false);
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        email: user.email,
        balance: user.balance,
        status: user.status,
        deductionCredit: user.deductionCredit,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        email: '',
        balance: 0,
        status: 'active',
        deductionCredit: 0,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        await axiosInstance.put(`/api/admin/users/${selectedUser._id}`, formData);
      } else {
        await axiosInstance.post('/api/admin/users', formData);
      }
      fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(t('error.savingUser'));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirm.deleteUser'))) {
      try {
        await axiosInstance.delete(`/api/admin/users/${id}`);
        fetchUsers();
      } catch (err) {
        setError(t('error.deletingUser'));
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: t('email'), width: 200 },
    { field: 'balance', headerName: t('balance'), width: 150 },
    {
      field: 'status',
      headerName: t('status'),
      width: 150,
      valueGetter: (params: GridValueGetterParams) => t(`status.${params.row.status}`),
    },
    { field: 'deductionCredit', headerName: t('deductionCredit'), width: 150 },
    {
      field: 'createdAt',
      headerName: t('createdAt'),
      width: 200,
      valueGetter: (params: GridValueGetterParams) =>
        new Date(params.row.createdAt).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: t('actions'),
      width: 150,
      renderCell: (params: GridRenderCellParams) => (
        <Box>
          <Tooltip title={t('edit')}>
            <IconButton onClick={() => handleOpenDialog(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('delete')}>
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h1">
            {t('userManagement')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            {t('addUser')}
          </Button>
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={users}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            loading={loading}
            getRowId={(row) => row._id}
          />
        </div>
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedUser ? t('editUser') : t('addUser')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('email')}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!!selectedUser}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('balance')}
                type="number"
                value={formData.balance}
                onChange={(e) => setFormData({ ...formData, balance: Number(e.target.value) })}
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
    </Box>
  );
};

export default UserManagement; 