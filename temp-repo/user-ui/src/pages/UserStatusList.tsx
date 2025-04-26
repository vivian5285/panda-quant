import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  TextField
} from '@mui/material';
import { DataGrid, GridColDef, GridValueFormatterParams, GridRenderCellParams } from '@mui/x-data-grid';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface User {
  _id: string;
  email: string;
  balance: number;
  deductionCredit: number;
  status: string;
  createdAt: string;
}

const UserStatusList: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    const statusMap: Record<string, { label: string; color: 'success' | 'warning' | 'error' }> = {
      active: { label: t('userStatus.active'), color: 'success' },
      insufficient_balance: { label: t('userStatus.insufficientBalance'), color: 'warning' },
      suspended: { label: t('userStatus.suspended'), color: 'error' }
    };

    const statusInfo = statusMap[status] || { label: status, color: 'default' };
    return <Chip label={statusInfo.label} color={statusInfo.color} />;
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: t('userStatus.email'), width: 200 },
    { field: 'balance', headerName: t('userStatus.balance'), width: 130 },
    { field: 'deductionCredit', headerName: t('userStatus.deductionCredit'), width: 130 },
    { 
      field: 'status', 
      headerName: t('userStatus.status'), 
      width: 130,
      renderCell: (params: GridRenderCellParams) => getStatusChip(params.value)
    },
    { field: 'createdAt', headerName: t('userStatus.createdAt'), width: 180 }
  ];

  const handleEdit = (userId: string) => {
    // Handle edit action
    console.log('Edit user:', userId);
  };

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Paper sx={{ p: 2 }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{t('userStatus.title')}</Typography>
          <TextField
            label={t('userStatus.search')}
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <DataGrid
          rows={filteredUsers}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
          loading={loading}
          getRowId={(row) => row._id}
        />
      </Paper>
    </Box>
  );
};

export default UserStatusList; 