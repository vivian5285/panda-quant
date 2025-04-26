import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  useTheme,
  Paper,
  Grid,
  Avatar,
  Divider,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShieldIcon from '@mui/icons-material/Shield';
import { motion } from 'framer-motion';
import { fadeIn, slideUp } from '../animations';
import { useTranslation } from 'react-i18next';
import GlobalBackground from '../components/common/GlobalBackground';

const Login = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { loginWithEmail } = useAuth();
  const { showNotification } = useNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginWithEmail(formData.email, formData.password);
      showNotification('登录成功', 'success');
      navigate('/dashboard');
    } catch (error) {
      showNotification('登录失败，请检查邮箱和密码', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      py: { xs: 8, md: 12 },
      overflow: 'hidden',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.1) 0%, rgba(0, 0, 0, 0) 100%)',
        zIndex: 0,
      },
    }}>
      <GlobalBackground />
      
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          px: { xs: 2, md: 4 }
        }}
      >
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  欢迎回来
                </Typography>
                <Typography variant="h5" color="text.secondary" sx={{ mb: 3 }}>
                  登录您的账户，开始智能交易之旅
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(0, 255, 184, 0.05)',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 255, 184, 0.1)',
                    },
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">智能交易</Typography>
                  <Typography variant="body2" color="text.secondary">
                    月化收益50%-300%
                  </Typography>
                </Paper>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    flex: 1,
                    textAlign: 'center',
                    background: 'rgba(0, 255, 184, 0.05)',
                    borderRadius: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 24px rgba(0, 255, 184, 0.1)',
                    },
                  }}
                >
                  <ShieldIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h6">安全保障</Typography>
                  <Typography variant="body2" color="text.secondary">
                    银行级安全防护
                  </Typography>
                </Paper>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: 'primary.main',
                      mb: 2,
                      mx: 'auto',
                    }}
                  >
                    <AccountCircleIcon sx={{ fontSize: 50 }} />
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    登录账户
                  </Typography>
                </Box>

                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="邮箱"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <TextField
                    fullWidth
                    label="密码"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="primary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    type="submit"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #00FFB8 40%, #00B8FF 100%)',
                      },
                    }}
                  >
                    {loading ? '登录中...' : '登录'}
                    <ArrowForwardIcon sx={{ ml: 1 }} />
                  </Button>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      还没有账户？{' '}
                      <Link
                        to="/register"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        立即注册
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login; 