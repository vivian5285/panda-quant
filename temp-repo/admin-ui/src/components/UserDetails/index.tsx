import React from 'react';
import {
  Box,
  Grid,
  Avatar,
  Typography,
  Button,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Edit as EditIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import { StyledCard, StyledBox, StyledTypography } from '../common/StyledComponents';
import { themeUtils } from '../../theme';

interface UserDetailsProps {
  user: {
    id: string;
    username: string;
    email: string;
    phone?: string;
    location?: string;
    status: 'active' | 'inactive' | 'suspended';
    role: 'admin' | 'user' | 'manager';
    joinDate: string;
    lastLogin: string;
    avatar?: string;
  };
  onEdit: () => void;
}

const UserDetails: React.FC<UserDetailsProps> = ({ user, onEdit }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'warning';
      case 'user':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <StyledCard>
          <StyledBox sx={{ textAlign: 'center' }}>
            <Avatar
              src={user.avatar}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: themeUtils.palette.primary.main,
              }}
            >
              {user.username.charAt(0).toUpperCase()}
            </Avatar>
            <StyledTypography variant="h5" gutterBottom>
              {user.username}
            </StyledTypography>
            <Box sx={{ mb: 2 }}>
              <Chip
                label={user.status === 'active' ? '活跃' : user.status === 'inactive' ? '未激活' : '已暂停'}
                color={getStatusColor(user.status)}
                sx={{ mr: 1 }}
              />
              <Chip
                label={user.role === 'admin' ? '管理员' : user.role === 'manager' ? '经理' : '用户'}
                color={getRoleColor(user.role)}
              />
            </Box>
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{
                color: themeUtils.palette.primary.main,
                borderColor: themeUtils.palette.primary.main,
                '&:hover': {
                  borderColor: themeUtils.palette.primary.main,
                  backgroundColor: `${themeUtils.palette.primary.main}10`,
                },
              }}
            >
              编辑资料
            </Button>
          </StyledBox>
        </StyledCard>
      </Grid>

      <Grid item xs={12} md={8}>
        <StyledCard>
          <StyledBox>
            <StyledTypography variant="h6" gutterBottom>
              基本信息
            </StyledTypography>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon sx={{ color: themeUtils.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary={<StyledTypography>邮箱</StyledTypography>}
                  secondary={user.email}
                />
              </ListItem>
              {user.phone && (
                <ListItem>
                  <ListItemIcon>
                    <PhoneIcon sx={{ color: themeUtils.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<StyledTypography>电话</StyledTypography>}
                    secondary={user.phone}
                  />
                </ListItem>
              )}
              {user.location && (
                <ListItem>
                  <ListItemIcon>
                    <LocationIcon sx={{ color: themeUtils.palette.primary.main }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<StyledTypography>位置</StyledTypography>}
                    secondary={user.location}
                  />
                </ListItem>
              )}
            </List>

            <StyledTypography variant="h6" gutterBottom sx={{ mt: 3 }}>
              账户信息
            </StyledTypography>
            <Divider sx={{ my: 2 }} />
            <List>
              <ListItem>
                <ListItemIcon>
                  <CalendarIcon sx={{ color: themeUtils.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary={<StyledTypography>加入日期</StyledTypography>}
                  secondary={new Date(user.joinDate).toLocaleDateString()}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SecurityIcon sx={{ color: themeUtils.palette.primary.main }} />
                </ListItemIcon>
                <ListItemText
                  primary={<StyledTypography>最后登录</StyledTypography>}
                  secondary={new Date(user.lastLogin).toLocaleString()}
                />
              </ListItem>
            </List>
          </StyledBox>
        </StyledCard>
      </Grid>
    </Grid>
  );
};

export default UserDetails; 