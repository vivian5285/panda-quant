import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  useTheme,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Chip,
  Avatar,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ContentCopy as ContentCopyIcon,
  Share as ShareIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  Person as PersonIcon,
  AttachMoney as MoneyIcon,
  AccessTime as TimeIcon,
  People as PeopleIcon,
  AccountCircle as AccountCircleIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

interface CommissionRecord {
  username: string;
  amount: number;
  time: string;
}

interface User {
  inviteCode?: string;
  // Add other user properties as needed
}

const InviteSection = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [copySuccess, setCopySuccess] = useState(false);
  const { user } = useAuth();
  const inviteCode = (user as User)?.inviteCode || '';
  const [records, setRecords] = useState<CommissionRecord[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrolling, setIsScrolling] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 生成随机用户名
  const generateRandomUsername = () => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    let tail = '';
    
    // 生成6位尾号（字母和数字混合）
    for (let i = 0; i < 6; i++) {
      const isLetter = Math.random() > 0.3; // 70%概率是字母
      tail += isLetter 
        ? letters.charAt(Math.floor(Math.random() * letters.length))
        : numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return `用户${tail}****`;
  };

  // 生成随机返佣记录
  const generateRandomRecord = () => {
    const randomUsername = generateRandomUsername();
    // 使用指数分布生成更真实的金额分布
    const getRandomAmount = () => {
      const random = Math.random();
      if (random < 0.6) { // 60%的概率是小额
        return Math.floor(Math.random() * 100) + 1; // 1-100 USDT
      } else if (random < 0.9) { // 30%的概率是中等金额
        return Math.floor(Math.random() * 900) + 100; // 100-1000 USDT
      } else { // 10%的概率是大额
        return Math.floor(Math.random() * 9000) + 1000; // 1000-10000 USDT
      }
    };
    const randomAmount = getRandomAmount();
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    
    return {
      username: randomUsername,
      amount: randomAmount,
      time,
    };
  };

  useEffect(() => {
    // 初始化10条记录
    const initialRecords = Array.from({ length: 10 }, () => generateRandomRecord());
    setRecords(initialRecords);

    // 每3秒添加一条新记录
    const interval = setInterval(() => {
      setRecords(prev => {
        const newRecord = generateRandomRecord();
        return [...prev.slice(1), newRecord];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [records]);

  // 格式化时间
  const formatTime = (time: string) => {
    return time;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 300);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleShare = () => {
    const shareText = t('invite.share.text', { code: inviteCode });
    if (navigator.share) {
      navigator.share({
        title: t('invite.share.title'),
        text: shareText,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 300);
    }
  };

  const inviteBenefits = useMemo(() => [
    {
      level: t('invite.benefits.0.level', '一代'),
      rate: t('invite.benefits.0.rate', '20%'),
      description: t('invite.benefits.0.description', '直接邀请好友，获得其收益的20%'),
      color: theme.palette.primary.main,
    },
    {
      level: t('invite.benefits.1.level', '二代'),
      rate: t('invite.benefits.1.rate', '10%'),
      description: t('invite.benefits.1.description', '好友邀请的好友，获得其收益的10%'),
      color: theme.palette.primary.main,
    },
  ], [t, theme.palette]);

  const inviteData = useMemo(() => ({
    title: t('invite.title', '邀请返佣'),
    subtitle: t('invite.subtitle', '推荐好友赚 USDT，享受多重收益'),
    levels: [
      {
        level: t('invite.levels.1', '一代'),
        commission: '20%',
        description: t('invite.levels.1.description', '直接推荐好友的交易手续费'),
      },
      {
        level: t('invite.levels.2', '二代'),
        commission: '10%',
        description: t('invite.levels.2.description', '间接推荐好友的交易手续费'),
      },
    ],
    features: [
      t('invite.features.0', '实时返佣，自动结算'),
      t('invite.features.1', '多级返佣，收益倍增'),
      t('invite.features.2', '透明数据，随时查看'),
    ],
  }), [t]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
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
          transition={{ duration: 0.5 }}
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
            邀请返佣
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
            推荐好友赚 USDT，享受多重收益
          </Typography>
        </motion.div>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
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
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#333333',
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    邀请链接
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                    }}
                  >
                    {inviteBenefits.map((benefit, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 2,
                          p: 2,
                          borderRadius: '12px',
                          bgcolor: 'rgba(0, 255, 184, 0.05)',
                        }}
                      >
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                            color: '#00FFB8',
                          }}
                        >
                          {index + 1}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: '#333333',
                              fontWeight: 600,
                            }}
                          >
                            {benefit.level}返佣 {benefit.rate}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: '#666666',
                            }}
                          >
                            {benefit.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 2,
                      mt: 2,
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#333333',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <ShareIcon sx={{ color: '#00FFB8' }} />
                      邀请链接
                    </Typography>
                    {user ? (
                      <Box
                        sx={{
                          display: 'flex',
                          gap: 2,
                        }}
                      >
                        <TextField
                          fullWidth
                          value={`https://panda-quant.com/invite/${inviteCode}`}
                          InputProps={{
                            readOnly: true,
                            sx: {
                              borderRadius: '12px',
                              bgcolor: 'rgba(0, 255, 184, 0.05)',
                              '& fieldset': {
                                borderColor: 'rgba(0, 255, 184, 0.2)',
                              },
                              '& input': {
                                color: '#333333',
                                fontWeight: 500,
                              },
                            },
                          }}
                        />
                        <Button
                          variant="contained"
                          onClick={handleCopy}
                          sx={{
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                            color: '#00FFB8',
                            minWidth: 'auto',
                            px: 2,
                            borderRadius: '12px',
                            '&:hover': {
                              bgcolor: 'rgba(0, 255, 184, 0.2)',
                            },
                          }}
                        >
                          {copySuccess ? <CheckCircleIcon /> : <ContentCopyIcon />}
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: '12px',
                          bgcolor: 'rgba(0, 255, 184, 0.05)',
                          textAlign: 'center',
                        }}
                      >
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#666666',
                            mb: 2,
                        }}
                      >
                          登录后即可获取专属邀请链接
                      </Typography>
                      <Button
                        variant="contained"
                        href="/login"
                        sx={{
                          bgcolor: '#00FFB8',
                            color: '#FFFFFF',
                            px: 4,
                            py: 1.5,
                            borderRadius: '12px',
                            fontSize: '1.1rem',
                          fontWeight: 600,
                          '&:hover': {
                              bgcolor: '#00E0A3',
                          },
                        }}
                      >
                          立即登录
                      </Button>
                    </Box>
                  )}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
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
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#333333',
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    实时返佣记录
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#00FFB8',
                        fontWeight: 600,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <PeopleIcon />
                      实时返佣
                    </Typography>
                    <Box
                      ref={scrollContainerRef}
                      sx={{
                        height: '400px',
                        width: '100%',
                        overflow: 'hidden',
                        position: 'relative',
                        '&::before, &::after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          height: '40px',
                          zIndex: 1,
                          pointerEvents: 'none',
                        },
                        '&::before': {
                          top: 0,
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), transparent)',
                        },
                        '&::after': {
                          bottom: 0,
                          background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          height: '100%',
                          width: '100%',
                          overflowY: 'auto',
                          scrollBehavior: 'smooth',
                          '&::-webkit-scrollbar': {
                            width: '4px',
                          },
                          '&::-webkit-scrollbar-track': {
                            background: 'rgba(0, 255, 184, 0.1)',
                            borderRadius: '2px',
                          },
                          '&::-webkit-scrollbar-thumb': {
                            background: '#00FFB8',
                            borderRadius: '2px',
                          },
                        }}
                      >
                        <AnimatePresence mode="popLayout">
                          {records.map((record, index) => (
                            <motion.div
                              key={index}
                              initial={{ 
                                opacity: 0, 
                                y: 200,
                                scale: 0.8,
                                '--blur': '4px',
                                x: 50
                              }}
                              animate={{ 
                                opacity: 1, 
                                y: 0,
                                scale: 1,
                                '--blur': '0px',
                                x: 0
                              }}
                              exit={{ 
                                opacity: 0, 
                                y: -150,
                                scale: 1.2,
                                '--blur': '4px',
                                x: -50
                              }}
                              style={{
                                filter: 'blur(var(--blur))'
                              }}
                              transition={{ 
                                duration: 0.8,
                                delay: index * 0.15,
                                type: "spring",
                                stiffness: 150,
                                damping: 12,
                                mass: 0.8,
                                exit: {
                                  duration: 0.5,
                                  ease: "easeInOut"
                                }
                              }}
                              layout
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  p: 3,
                                  mb: 2,
                                  mx: 3,
                                  borderRadius: 4,
                                  bgcolor: 'rgba(0, 255, 184, 0.05)',
                                  border: '1px solid rgba(0, 255, 184, 0.2)',
                                  boxShadow: '0 4px 12px rgba(0, 255, 184, 0.15)',
                                  transform: 'translateZ(0)',
                                  '&:hover': {
                                    bgcolor: 'rgba(0, 255, 184, 0.08)',
                                    transform: 'translateY(-2px) scale(1.02)',
                                    boxShadow: '0 6px 16px rgba(0, 255, 184, 0.2)',
                                  },
                                  transition: 'all 0.3s ease',
                                }}
                              >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                                  <AccountCircleIcon sx={{ 
                                    color: '#00FFB8',
                                    fontSize: '2.5rem',
                                    filter: 'drop-shadow(0 2px 4px rgba(0, 255, 184, 0.3))'
                                  }} />
                                  <Box>
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: '#00FFB8',
                                        fontWeight: 600,
                                        fontSize: '1.2rem',
                                      }}
                                    >
                                      {record.username}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color: 'rgba(0, 255, 184, 0.7)',
                                        fontSize: '0.9rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                      }}
                                    >
                                      <AccessTimeIcon sx={{ fontSize: '1rem' }} />
                                      {formatTime(record.time)}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#00FFB8',
                                    fontWeight: 700,
                                    fontSize: '1.3rem',
                                    textShadow: '0 2px 4px rgba(0, 255, 184, 0.3)',
                                  }}
                                >
                                  +{record.amount.toLocaleString()} USDT
                                </Typography>
                              </Box>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default InviteSection; 