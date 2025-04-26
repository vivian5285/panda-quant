import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Box, Typography, Container, useTheme, Paper, TextField, Button, InputAdornment, IconButton, Grid, Avatar } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { 
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  VpnKey as VpnKeyIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import PandaCard from '../components/common/PandaCard';
import AuthForm from '../components/common/AuthForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { themeUtils } from '../theme';
import { fadeIn, slideUp } from '@/animations';
import GlobalBackground from '@/components/common/GlobalBackground';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showNotification } = useNotification();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showNotification('两次输入的密码不一致', 'error');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await register(formData.email, formData.password, formData.username);
      showNotification('注册成功', 'success');
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || t('register.error');
      setError(errorMessage);
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <GlobalBackground />
      
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <Box sx={{ 
                textAlign: 'center',
                mb: 4,
              }}>
                <motion.div
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '8rem',
                      lineHeight: 1,
                      mb: 2,
                    }}
                  >
                    🐼
                  </Typography>
                </motion.div>
                <Typography
                  variant="h2"
                  sx={{
                    color: '#00FFB8',
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2,
                    background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  加入熊猫量化
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    color: '#666666',
                    mb: 4,
                    fontSize: '1.2rem',
                  }}
                >
                  开启您的智能量化交易之旅
                </Typography>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 255, 184, 0.1)',
                  boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                }}
              >
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="用户名"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon sx={{ color: '#00FFB8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 255, 184, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00FFB8',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00FFB8',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="邮箱"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: '#00FFB8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 255, 184, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00FFB8',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00FFB8',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="密码"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#00FFB8' }} />
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
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 255, 184, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00FFB8',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00FFB8',
                        },
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="确认密码"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon sx={{ color: '#00FFB8' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(0, 255, 184, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#00FFB8',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#00FFB8',
                        },
                      },
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      bgcolor: '#00FFB8',
                      color: '#000000',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: '#00CC93',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 20px rgba(0, 255, 184, 0.3)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? '注册中...' : '注册'}
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 1.5,
                      borderColor: '#00FFB8',
                      color: '#00FFB8',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': {
                        borderColor: '#00CC93',
                        bgcolor: 'rgba(0, 255, 184, 0.1)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    已有账户？立即登录
                  </Button>
                </form>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
      
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Box>
  );
};

export default Register; 