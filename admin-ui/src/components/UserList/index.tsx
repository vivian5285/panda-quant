import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { StyledCard, StyledBox, StyledTypography } from '../common/StyledComponents';
import { themeUtils } from '../../theme';

interface User {
  id: string;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  role: 'admin' | 'user' | 'manager';
  lastLogin: string;
  avatar?: string;
}

interface UserListProps {
  users: User[];
  onEditUser: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEditUser }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'error';
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'user':
        return 'info';
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledCard>
      <StyledBox>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: themeUtils.palette.primary.main }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    用户
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    状态
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    角色
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    最后登录
                  </StyledTypography>
                </TableCell>
                <TableCell align="right">
                  <StyledTypography variant="subtitle1">
                    操作
                  </StyledTypography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={user.avatar}
                          sx={{
                            width: 40,
                            height: 40,
                            mr: 2,
                            bgcolor: themeUtils.palette.primary.main,
                          }}
                        >
                          {user.username.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <StyledTypography variant="subtitle2">
                            {user.username}
                          </StyledTypography>
                          <StyledTypography variant="body2" color="text.secondary">
                            {user.email}
                          </StyledTypography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status === 'active' ? '活跃' : user.status === 'inactive' ? '未激活' : '已暂停'}
                        color={getStatusColor(user.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.role === 'admin' ? '管理员' : user.role === 'manager' ? '经理' : '用户'}
                        color={getRoleColor(user.role)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <StyledTypography>
                        {new Date(user.lastLogin).toLocaleString()}
                      </StyledTypography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => onEditUser(user.id)}
                        sx={{
                          color: themeUtils.palette.primary.main,
                          '&:hover': {
                            backgroundColor: `${themeUtils.palette.primary.main}10`,
                          },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredUsers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </StyledBox>
    </StyledCard>
  );
};

export default UserList; 