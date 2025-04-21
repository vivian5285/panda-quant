import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Container, useTheme } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { 
  Email as EmailIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import PandaCard from '../components/common/PandaCard';
import AuthForm from '../components/common/AuthForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { themeUtils } from '../theme';

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

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleSubmit = async (data: Record<string, string>) => {
    setLoading(true);
    setError(null);

    try {
      await register(
        data.email,
        data.password,
        data.username,
        data.verificationCode
      );
      toast.success(t('register.success'));
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || t('register.error');
      setError(errorMessage);
      toast.error(errorMessage);
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
              title="欢迎加入"
              content="欢迎加入熊猫量化大家庭！在这里，我们将为您提供最专业的量化交易服务，让您的投资之路更加顺畅。让我们一起开启智能交易的新篇章！"
              image="/panda-happy.png"
              imagePosition="right"
              backgroundColor="rgba(255, 255, 255, 0.1)"
              borderRadius={4}
              padding={4}
              boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
              backdropFilter="blur(10px)"
            />
          </Box>

          {/* 右侧注册表单 */}
          <Box
            component={motion.div}
            variants={slideInRight}
            initial="initial"
            animate="animate"
            sx={{
              flex: 1,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Logo和标题 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Box
                component="img"
                src="/panda-logo.png"
                sx={{
                  width: 120,
                  height: 120,
                  mb: 2,
                  filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
                }}
              />
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                熊猫量化
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center',
                  mt: 1,
                }}
              >
                智能交易，简单生活
              </Typography>
            </Box>

            <AuthForm
              type="register"
              method="email"
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </Box>
        </Box>
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