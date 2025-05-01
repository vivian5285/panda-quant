import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { User } from '../../types/user';

interface UserListProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onViewDetails: (user: User) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onEdit, onDelete, onViewDetails }) => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.warning.main;
      case 'suspended':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: string): React.ReactElement => {
    switch (status) {
      case 'active':
        return <VerifiedIcon />;
      case 'inactive':
        return <WarningIcon />;
      case 'suspended':
        return <WarningIcon />;
      default:
        return <InfoIcon />;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        mb: 4
      }}>
        用户管理
      </Typography>

      <Card sx={{ 
        background: theme.palette.background.paper,
        boxShadow: 'none',
        borderRadius: 2,
        mb: 3
      }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="搜索用户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.04),
                },
              },
            }}
          />
        </CardContent>
      </Card>

      <Card sx={{ 
        background: theme.palette.background.paper,
        boxShadow: 'none',
        borderRadius: 2
      }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>用户名</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>邮箱</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>角色</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>状态</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>注册时间</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>最后登录</TableCell>
                <TableCell sx={{ 
                  fontWeight: 'bold',
                  color: theme.palette.text.secondary
                }}>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user._id}
                  sx={{
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      {user.username}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      {user.email}
                    </Box>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(user.status)}
                      label={user.status}
                      sx={{
                        backgroundColor: alpha(getStatusColor(user.status), 0.1),
                        color: getStatusColor(user.status),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      {format(new Date(user.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                      {format(new Date(user.lastLogin), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="编辑">
                        <IconButton
                          onClick={() => onEdit(user)}
                          sx={{ color: theme.palette.primary.main }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="删除">
                        <IconButton
                          onClick={() => onDelete(user)}
                          sx={{ color: theme.palette.error.main }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
};

export default UserList; 