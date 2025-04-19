import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  InputAdornment,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon } from '@mui/icons-material';
import { getUsers, User } from '../api/user';

interface ExtendedUser extends User {
  status: string;
}

const UserStatusList: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data.map(user => ({
        ...user,
        status: 'active' // 设置默认状态
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const columns: GridColDef[] = [
    { field: 'email', headerName: t('user.email'), flex: 1 },
    { field: 'status', headerName: t('user.status'), width: 120 },
    { field: 'createdAt', headerName: t('user.createdAt'), width: 200 },
  ];

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('user.statusList')}
      </Typography>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t('search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      <DataGrid
        rows={filteredUsers}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10, page: 0 },
          },
        }}
        pageSizeOptions={[10]}
        getRowId={(row) => row._id}
      />
    </Box>
  );
};

export default UserStatusList; 