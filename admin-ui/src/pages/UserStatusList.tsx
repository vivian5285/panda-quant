import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

interface User {
  _id: string;
  email: string;
  balance: number;
  deductionCredit: number;
  status: 'active' | 'insufficient_balance' | 'suspended';
}

const UserStatusList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (user: User) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setRewardAmount('');
  };

  const handleRewardSubmit = async () => {
    if (!selectedUser || !rewardAmount) return;

    try {
      await axios.post(`/api/admin/users/${selectedUser._id}/reward`, {
        amount: parseFloat(rewardAmount)
      });
      handleCloseDialog();
      fetchUsers();
    } catch (err) {
      console.error('Error rewarding user:', err);
      setError('Failed to reward user');
    }
  };

  const getStatusChip = (status: string) => {
    const colorMap: Record<string, 'success' | 'error' | 'warning'> = {
      active: 'success',
      insufficient_balance: 'error',
      suspended: 'warning'
    };

    return (
      <Chip
        label={status.toUpperCase()}
        color={colorMap[status]}
        size="small"
      />
    );
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: 'Email', flex: 1 },
    {
      field: 'balance',
      headerName: 'Balance',
      flex: 1,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'deductionCredit',
      headerName: 'Deduction Credit',
      flex: 1,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => getStatusChip(params.value)
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            sx={{ mr: 1 }}
          >
            Reward
          </Button>
          <Button
            variant="contained"
            color={params.row.status === 'suspended' ? 'success' : 'error'}
            size="small"
            onClick={() => handleToggleStatus(params.row)}
          >
            {params.row.status === 'suspended' ? 'Enable' : 'Suspend'}
          </Button>
        </Box>
      )
    }
  ];

  const handleToggleStatus = async (user: User) => {
    try {
      const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
      await axios.put(`/api/admin/users/${user._id}/status`, {
        status: newStatus
      });
      fetchUsers();
    } catch (err) {
      console.error('Error toggling user status:', err);
      setError('Failed to update user status');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">User Status Management</Typography>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          loading={loading}
          getRowId={(row) => row._id}
        />
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Reward User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reward Amount"
            type="number"
            fullWidth
            value={rewardAmount}
            onChange={(e) => setRewardAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleRewardSubmit} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserStatusList; 