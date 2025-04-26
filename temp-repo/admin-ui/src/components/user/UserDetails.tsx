import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  useTheme,
  alpha,
  CircularProgress,
  Divider,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Verified as VerifiedIcon,
  Warning as WarningIcon,
  AccountBalance as BalanceIcon,
  Timeline as TimelineIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface UserDetails {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  address?: string;
  role: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string;
  balance: number;
  totalProfit: number;
  securityLevel: number;
}

const UserDetails: React.FC<{ userId: string }> = ({ userId }) => {
  const theme = useTheme();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <VerifiedIcon />;
      case 'inactive':
        return <WarningIcon />;
      case 'suspended':
        return <WarningIcon />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        mb: 4
      }}>
        用户详情
      </Typography>

      <Grid container spacing={3}>
        {/* 基本信息卡片 */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card sx={{
              background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              boxShadow: 'none',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.3s ease-in-out'
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 2,
                      background: theme.palette.primary.main
                    }}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Typography variant="h5" sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 'bold'
                  }}>
                    {user.username}
                  </Typography>
                  <Chip
                    icon={getStatusIcon(user.status)}
                    label={user.status}
                    sx={{
                      mt: 1,
                      backgroundColor: alpha(getStatusColor(user.status), 0.1),
                      color: getStatusColor(user.status),
                      borderRadius: 1,
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <EmailIcon sx={{ 
                      color: theme.palette.primary.main,
                      mr: 1
                    }} />
                    <Typography>{user.email}</Typography>
                  </Box>
                  {user.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ 
                        color: theme.palette.primary.main,
                        mr: 1
                      }} />
                      <Typography>{user.phone}</Typography>
                    </Box>
                  )}
                  {user.address && (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationIcon sx={{ 
                        color: theme.palette.primary.main,
                        mr: 1
                      }} />
                      <Typography>{user.address}</Typography>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CalendarIcon sx={{ 
                      color: theme.palette.primary.main,
                      mr: 1
                    }} />
                    <Typography>
                      注册时间: {format(new Date(user.createdAt), 'yyyy-MM-dd', { locale: zhCN })}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* 统计信息卡片 */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                  boxShadow: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BalanceIcon sx={{ 
                        color: theme.palette.success.main,
                        mr: 1,
                        fontSize: 30
                      }} />
                      <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                        账户余额
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ 
                      color: theme.palette.success.main,
                      fontWeight: 'bold'
                    }}>
                      ${user.balance.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)} 0%, ${alpha(theme.palette.warning.main, 0.05)} 100%)`,
                  boxShadow: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <TimelineIcon sx={{ 
                        color: theme.palette.warning.main,
                        mr: 1,
                        fontSize: 30
                      }} />
                      <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                        总收益
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ 
                      color: theme.palette.warning.main,
                      fontWeight: 'bold'
                    }}>
                      ${user.totalProfit.toFixed(2)}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card sx={{
                  background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)} 0%, ${alpha(theme.palette.info.main, 0.05)} 100%)`,
                  boxShadow: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SecurityIcon sx={{ 
                        color: theme.palette.info.main,
                        mr: 1,
                        fontSize: 30
                      }} />
                      <Typography color="textSecondary" sx={{ fontSize: '1.1rem' }}>
                        安全等级
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ 
                      color: theme.palette.info.main,
                      fontWeight: 'bold'
                    }}>
                      {user.securityLevel}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDetails; 