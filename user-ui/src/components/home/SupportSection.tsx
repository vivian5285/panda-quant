import React from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  Card,
  CardContent,
  Button,
  Avatar,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  SupportAgent as SupportIcon,
  Email as EmailIcon,
  Forum as ForumIcon,
  HelpCenter as HelpIcon,
} from '@mui/icons-material';
import { themeUtils } from '../../theme';

interface Support {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: string;
}

const supports: Support[] = [
  {
    id: 1,
    title: '在线客服',
    description: '7x24小时专业客服团队，随时解答您的问题',
    icon: <SupportIcon />,
    color: '#00FFB8',
    action: '联系客服',
  },
  {
    id: 2,
    title: '邮件支持',
    description: '发送邮件至 support@pandaquant.com，我们将在24小时内回复',
    icon: <EmailIcon />,
    color: '#00FFB8',
    action: '发送邮件',
  },
  {
    id: 3,
    title: '社区论坛',
    description: '加入我们的社区，与其他用户交流经验，分享心得',
    icon: <ForumIcon />,
    color: '#00FFB8',
    action: '加入社区',
  },
  {
    id: 4,
    title: '帮助中心',
    description: '查看常见问题解答，快速解决您的问题',
    icon: <HelpIcon />,
    color: '#00FFB8',
    action: '查看帮助',
  },
];

const SupportSection = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.05) 0%, rgba(0, 255, 184, 0.02) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: themeUtils.animationConfig.duration.medium }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#00FFB8',
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              lineHeight: 1.2,
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #00FFB8, transparent)',
                borderRadius: '2px',
              },
            }}
          >
            支持服务
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#666666',
              textAlign: 'center',
              mb: 6,
              fontSize: '1.2rem',
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            全方位的支持服务，让您的交易之旅更加顺畅
          </Typography>
        </motion.div>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            position: 'relative',
          }}
        >
          {supports.map((support, index) => (
            <motion.div
              key={support.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: themeUtils.animationConfig.duration.medium,
                delay: index * themeUtils.animationConfig.delay.small 
              }}
              style={{ flex: 1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  border: '1px solid rgba(0, 255, 184, 0.1)',
                  borderRadius: '24px',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, transparent, rgba(0,255,184,0.05), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 30px rgba(0, 255, 184, 0.15)',
                    border: '1px solid rgba(0, 255, 184, 0.2)',
                    '&::before': {
                      transform: 'translateX(100%)',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      height: '100%',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'rgba(0, 255, 184, 0.1)',
                        color: '#00FFB8',
                        mb: 3,
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          borderRadius: '50%',
                          background: 'radial-gradient(circle, rgba(0,255,184,0.2) 0%, rgba(0,255,184,0) 70%)',
                          animation: 'pulse 3s ease-in-out infinite',
                          '@keyframes pulse': {
                            '0%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.2)' },
                            '100%': { transform: 'scale(1)' },
                          },
                        },
                      }}
                    >
                      {support.icon}
                    </Avatar>
                    <Typography
                      variant="h5"
                      sx={{
                        color: '#333333',
                        fontWeight: 600,
                        mb: 2,
                      }}
                    >
                      {support.title}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#666666',
                        lineHeight: 1.8,
                        mb: 3,
                        flex: 1,
                      }}
                    >
                      {support.description}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: 'rgba(0, 255, 184, 0.1)',
                        color: '#00FFB8',
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        borderRadius: '12px',
                        '&:hover': {
                          bgcolor: 'rgba(0, 255, 184, 0.2)',
                        },
                      }}
                    >
                      {support.action}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default SupportSection; 