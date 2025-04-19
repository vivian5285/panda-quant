import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { getUsers, createUser, updateUser, deleteUser, User } from '../api/user';

interface ExtendedUser extends User {
  _id: string;
}

const UserManagement: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [formData, setFormData] = useState<{
    email: string;
    password: string;
    role: 'admin' | 'user';
    username: string;
  }>({
    email: '',
    password: '',
    role: 'user',
    username: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data.map(user => ({
        ...user,
        _id: user.id || '',
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      await createUser({
        ...formData,
        username: formData.email.split('@')[0], // 使用邮箱前缀作为用户名
      });
      setOpenDialog(false);
      setFormData({ email: '', password: '', role: 'user', username: '' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (id: string, data: Partial<ExtendedUser>) => {
    try {
      await updateUser(id, data);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const columns: GridColDef<ExtendedUser>[] = [
    { field: 'email', headerName: t('user.email'), flex: 1 },
    { field: 'role', headerName: t('user.role'), width: 120 },
    {
      field: 'actions',
      headerName: t('common.actions'),
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            size="small"
            onClick={() => handleUpdateUser(params.row._id, { role: 'admin' })}
          >
            {t('user.makeAdmin')}
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDeleteUser(params.row._id)}
          >
            {t('common.delete')}
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: 2, bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
          <Typography variant="h5" sx={{ color: '#333333', fontWeight: 'bold' }}>
            {t('user.title')}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{
              bgcolor: '#00FFB8',
              '&:hover': {
                bgcolor: '#00E6A5',
              },
            }}
          >
            {t('user.add')}
          </Button>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid<ExtendedUser>
            rows={users}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5]}
            getRowId={(row) => row._id}
            loading={loading}
          />
        </Box>
      </Paper>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('user.add')}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('user.email')}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('user.password')}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('common.cancel')}</Button>
          <Button onClick={handleCreateUser} variant="contained" sx={{ bgcolor: '#00FFB8' }}>
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement; 