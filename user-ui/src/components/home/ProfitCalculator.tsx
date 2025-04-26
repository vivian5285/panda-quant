import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Slider,
  Grid,
  Paper,
  InputAdornment,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Container,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Balance as BalanceIcon,
} from '@mui/icons-material';

const ProfitCalculator: React.FC = () => {
  const [investment, setInvestment] = useState<number>(10000);
  const [duration, setDuration] = useState<number>(12);
  const [strategy, setStrategy] = useState<string>('conservative');

  const calculateProfit = () => {
    const baseRates = {
      conservative: 0.15,
      balanced: 0.25,
      aggressive: 0.35,
    };

    const monthlyRate = baseRates[strategy as keyof typeof baseRates] / 12;
    const totalMonths = duration;
    const totalProfit = investment * Math.pow(1 + monthlyRate, totalMonths) - investment;
    return totalProfit;
  };

  const totalProfit = calculateProfit();
  const totalAmount = investment + totalProfit;
  const monthlyProfit = totalProfit / duration;

  const strategyIcons = {
    conservative: <SecurityIcon sx={{ color: '#00FFB8', fontSize: 30 }} />,
    balanced: <BalanceIcon sx={{ color: '#00FFB8', fontSize: 30 }} />,
    aggressive: <SpeedIcon sx={{ color: '#00FFB8', fontSize: 30 }} />,
  };

  const strategyDescriptions = {
    conservative: '低风险，稳定收益',
    balanced: '风险适中，收益可观',
    aggressive: '高风险，高收益',
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: { xs: 6, md: 10 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
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
      <Container 
        maxWidth="lg" 
        sx={{ 
          position: 'relative', 
          zIndex: 1,
          px: { xs: 2, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100%',
          flex: 1,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: '100%' }}
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
              fontWeight: 700,
              textAlign: 'center',
              mb: 2,
              color: '#00FFB8',
              textShadow: '0 0 10px rgba(0, 255, 184, 0.3)',
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
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
            收益计算器
          </Typography>
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 6,
              color: '#666',
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              fontSize: { xs: '1.1rem', md: '1.25rem' },
            }}
          >
            计算您的潜在收益，开启量化交易之旅
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <FormControl component="fieldset" sx={{ mb: 4 }}>
                      <FormLabel
                        sx={{
                          color: '#00FFB8',
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          mb: 2,
                        }}
                      >
                        选择策略
                      </FormLabel>
                      <RadioGroup
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                        sx={{ gap: 2 }}
                      >
                        {Object.entries(strategyIcons).map(([key, icon]) => (
                          <FormControlLabel
                            key={key}
                            value={key}
                            control={
                              <Radio
                                sx={{
                                  color: '#00FFB8',
                                  '&.Mui-checked': {
                                    color: '#00FFB8',
                                  },
                                }}
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {icon}
                                <Box>
                                  <Typography
                                    sx={{
                                      color: '#00FFB8',
                                      fontWeight: 600,
                                      textTransform: 'capitalize',
                                      fontSize: '1rem',
                                    }}
                                  >
                                    {key}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: 'text.secondary',
                                      fontSize: '0.9rem',
                                    }}
                                  >
                                    {strategyDescriptions[key as keyof typeof strategyDescriptions]}
                                  </Typography>
                                </Box>
                              </Box>
                            }
                            sx={{
                              border: '1px solid rgba(0, 255, 184, 0.2)',
                              borderRadius: 2,
                              px: 2,
                              py: 1,
                              '&:hover': {
                                bgcolor: 'rgba(0, 255, 184, 0.05)',
                              },
                            }}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>

                    <Box sx={{ mb: 4 }}>
                      <Typography
                        sx={{
                          color: '#00FFB8',
                          fontWeight: 600,
                          mb: 2,
                          fontSize: '1.1rem',
                        }}
                      >
                        投资金额
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        value={investment}
                        onChange={(e) => setInvestment(Number(e.target.value))}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MoneyIcon sx={{ color: '#00FFB8' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            '& fieldset': {
                              borderColor: 'rgba(0, 255, 184, 0.5)',
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
                    </Box>

                    <Box sx={{ mb: 4 }}>
                      <Typography
                        sx={{
                          color: '#00FFB8',
                          fontWeight: 600,
                          mb: 2,
                          fontSize: '1.1rem',
                        }}
                      >
                        投资期限（月）
                      </Typography>
                      <Slider
                        value={duration}
                        onChange={(_, value) => setDuration(value as number)}
                        min={1}
                        max={36}
                        step={1}
                        sx={{
                          color: '#00FFB8',
                          '& .MuiSlider-thumb': {
                            '&:hover, &.Mui-focusVisible': {
                              boxShadow: '0 0 0 8px rgba(0, 255, 184, 0.16)',
                            },
                            '&.Mui-active': {
                              boxShadow: '0 0 0 14px rgba(0, 255, 184, 0.16)',
                            },
                          },
                        }}
                      />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">1个月</Typography>
                        <Typography variant="body2" color="text.secondary">36个月</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                    border: '1px solid rgba(0, 255, 184, 0.1)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                      <TrendingUpIcon sx={{ fontSize: 60, color: '#00FFB8', mb: 2 }} />
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#00FFB8',
                          fontWeight: 700,
                          mb: 2,
                        }}
                      >
                        预计收益
                      </Typography>
                    </Box>

                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            总收益
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              color: '#00FFB8',
                              fontWeight: 700,
                            }}
                          >
                            ¥{totalProfit.toLocaleString()}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            月均收益
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              color: '#00FFB8',
                              fontWeight: 700,
                            }}
                          >
                            ¥{monthlyProfit.toLocaleString()}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={12}>
                        <Paper
                          sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" color="text.secondary" gutterBottom>
                            总金额
                          </Typography>
                          <Typography
                            variant="h4"
                            sx={{
                              color: '#00FFB8',
                              fontWeight: 700,
                            }}
                          >
                            ¥{totalAmount.toLocaleString()}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProfitCalculator; 