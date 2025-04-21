import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Tabs, Tab, useTheme, Avatar, Paper, Link } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import PandaCard from '../components/common/PandaCard';
import AuthForm from '../components/common/AuthForm';
import { useAuth } from '../contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const slideInLeft: Variants = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -100, opacity: 0 }
};

const slideInRight: Variants = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 }
};

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithWallet } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setError(null);
  };

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 0) {
        await login(data.email, data.password);
      } else if (activeTab === 1) {
        await loginWithWallet();
      } else {
        await login(data.email, data.password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/stars-bg.png)',
          backgroundSize: 'cover',
          opacity: 0.1,
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at center, rgba(0, 255, 184, 0.1) 0%, transparent 70%)',
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* 左侧熊猫卡片 */}
          <Box
            component={motion.div}
            variants={slideInLeft}
            initial="initial"
            animate="animate"
            sx={{
              flex: 1,
              display: { xs: 'none', md: 'block' },
            }}
          >
            <PandaCard
              title="欢迎回来"
              content="熊猫量化期待您的归来，让我们一起开启智能交易之旅。在这里，您将体验到最贴心的量化交易服务，让投资变得更简单、更智能。"
              image="/panda-happy.png"
              imagePosition="right"
              backgroundColor="rgba(255, 255, 255, 0.1)"
              borderRadius={4}
              padding={4}
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              backdropFilter="blur(10px)"
            />
          </Box>

          {/* 右侧登录表单 */}
          <Paper
            component={motion.div}
            variants={slideInRight}
            initial="initial"
            animate="animate"
            elevation={24}
            sx={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(0, 255, 184, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #00FFB8, #00CC93)',
              }
            }}
          >
            {/* Logo和标题 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                }}
              >
                <Typography
                  variant="h4"
                  sx={{
                    color: '#00FFB8',
                    fontWeight: 700,
                    fontSize: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <span style={{ fontSize: '2.8rem' }}>🐼</span>
                  <span style={{
                    background: 'linear-gradient(45deg, #00FFB8 30%, #00CC93 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Panda Quant
                  </span>
                </Typography>
              </Box>
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#666666',
                  textAlign: 'center',
                  mt: 1,
                  fontWeight: 500,
                }}
              >
                让量化交易成为您的第二大脑
              </Typography>
            </Box>

            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              centered
              sx={{
                mb: 4,
                '& .MuiTabs-indicator': {
                  backgroundColor: '#00FFB8',
                  height: 3,
                  borderRadius: 3,
                },
                '& .MuiTab-root': {
                  color: '#666666',
                  fontWeight: 500,
                  '&.Mui-selected': {
                    color: '#00FFB8',
                  },
                },
              }}
            >
              <Tab label="邮箱登录" />
              <Tab label="钱包登录" />
              <Tab label="邮箱注册" />
            </Tabs>

            <AuthForm
              type={activeTab === 2 ? 'register' : 'login'}
              method={activeTab === 1 ? 'wallet' : 'email'}
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />

            {activeTab !== 2 && (
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#666666' }}>
                  还没有账户？
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setActiveTab(2)}
                    sx={{
                      color: '#00FFB8',
                      textDecoration: 'none',
                      fontWeight: 500,
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    立即注册
                  </Link>
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>
      </Container>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default Login; 