import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Container,
  TextField,
  Slider,
  Button,
  useTheme,
  InputAdornment,
  IconButton,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Balance as BalanceIcon,
  ArrowForward as ArrowForwardIcon,
  Savings as SavingsIcon,
  Timeline as TimelineIcon,
  Rocket as RocketIcon,
} from '@mui/icons-material';

interface ProfitData {
  initialAmount: number;
  monthlyReturn: number;
  months: number;
  totalProfit: number;
  finalAmount: number;
  strategy: 'conservative' | 'balanced' | 'aggressive';
}

const strategyData = {
  conservative: {
    label: '保守策略',
    icon: <SavingsIcon />,
    description: '低风险，稳定收益',
    monthlyReturn: 50,
    color: '#4CAF50',
  },
  balanced: {
    label: '平衡策略',
    icon: <TimelineIcon />,
    description: '风险与收益平衡',
    monthlyReturn: 150,
    color: '#2196F3',
  },
  aggressive: {
    label: '激进策略',
    icon: <RocketIcon />,
    description: '高风险，高收益',
    monthlyReturn: 300,
    color: '#FF5722',
  },
};

const ProfitSection = () => {
  const theme = useTheme();
  const [profitData, setProfitData] = useState<ProfitData>({
    initialAmount: 10000,
    monthlyReturn: 50,
    months: 12,
    totalProfit: 0,
    finalAmount: 0,
    strategy: 'balanced',
  });

  const calculateProfit = useMemo(() => {
    const { initialAmount, monthlyReturn, months } = profitData;
    const monthlyRate = monthlyReturn / 100;
    let amount = initialAmount;
    let totalProfit = 0;

    for (let i = 0; i < months; i++) {
      const profit = amount * monthlyRate;
      totalProfit += profit;
      amount += profit;
    }

    return {
      totalProfit: Math.round(totalProfit * 100) / 100,
      finalAmount: Math.round(amount * 100) / 100,
    };
  }, [profitData]);

  const handleInputChange = (field: keyof ProfitData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setProfitData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSliderChange = (field: keyof ProfitData) => (
    event: Event,
    value: number | number[]
  ) => {
    setProfitData((prev) => ({
      ...prev,
      [field]: value as number,
    }));
  };

  const handleStrategyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const strategy = event.target.value as 'conservative' | 'balanced' | 'aggressive';
    setProfitData((prev) => ({
      ...prev,
      strategy,
      monthlyReturn: strategyData[strategy].monthlyReturn,
    }));
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 6, md: 10 },
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
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.03) 0%, rgba(0, 0, 0, 0) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              mb: 1,
              textAlign: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              background: 'linear-gradient(45deg, #00FFB8 30%, #00B8FF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            收益计算器
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              mb: 3,
              fontSize: '0.9rem',
              opacity: 0.8,
            }}
          >
            计算您的潜在收益，开启量化交易之旅
          </Typography>
        </motion.div>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  background: '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                  border: '1px solid rgba(0, 255, 184, 0.2)',
                  borderRadius: '12px',
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
                    background: 'linear-gradient(45deg, transparent, rgba(0,255,184,0.03), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 255, 184, 0.2)',
                    '&::before': {
                      transform: 'translateX(100%)',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: '#00FFB8',
                        fontWeight: 600,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <MoneyIcon />
                      初始投资金额 (USDT)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={profitData.initialAmount}
                      onChange={handleInputChange('initialAmount')}
                      size="small"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: '#000000',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <MoneyIcon sx={{ color: '#00FFB8' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography sx={{ color: '#00FFB8', fontSize: '0.8rem' }}>USDT</Typography>
                          </InputAdornment>
                        ),
                        sx: {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 255, 184, 0.2)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00FFB8',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00FFB8',
                          },
                        },
                      }}
                    />
                    <Slider
                      value={profitData.initialAmount}
                      onChange={handleSliderChange('initialAmount')}
                      min={1000}
                      max={100000}
                      step={1000}
                      sx={{
                        color: '#00FFB8',
                        mt: 1,
                        '& .MuiSlider-thumb': {
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0 0 0 8px rgba(0, 255, 184, 0.16)',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: '#00FFB8',
                        fontWeight: 600,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <TrendingUpIcon />
                      月收益率 (%)
                    </Typography>
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        border: '1px solid rgba(0, 255, 184, 0.2)',
                        bgcolor: 'rgba(0, 255, 184, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          color: '#00FFB8',
                          fontWeight: 700,
                          fontSize: '1.5rem',
                        }}
                      >
                        {profitData.monthlyReturn}%
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mt: 1,
                        textAlign: 'center',
                        fontSize: '0.8rem',
                      }}
                    >
                      当前策略: {strategyData[profitData.strategy].label}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: '#00FFB8',
                        fontWeight: 600,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <SecurityIcon />
                      投资期限 (月)
                    </Typography>
                    <TextField
                      fullWidth
                      type="number"
                      value={profitData.months}
                      onChange={handleInputChange('months')}
                      size="small"
                      sx={{
                        '& .MuiInputBase-input': {
                          color: '#000000',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Typography sx={{ color: '#00FFB8', fontSize: '0.8rem' }}>个月</Typography>
                          </InputAdornment>
                        ),
                        sx: {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 255, 184, 0.2)',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00FFB8',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#00FFB8',
                          },
                        },
                      }}
                    />
                    <Slider
                      value={profitData.months}
                      onChange={handleSliderChange('months')}
                      min={1}
                      max={36}
                      step={1}
                      sx={{
                        color: '#00FFB8',
                        mt: 1,
                        '& .MuiSlider-thumb': {
                          '&:hover, &.Mui-focusVisible': {
                            boxShadow: '0 0 0 8px rgba(0, 255, 184, 0.16)',
                          },
                        },
                      }}
                    />
                  </Box>

                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        color: '#00FFB8',
                        fontWeight: 600,
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      <BalanceIcon />
                      投资策略
                    </Typography>
                    <FormControl component="fieldset">
                      <RadioGroup
                        value={profitData.strategy}
                        onChange={handleStrategyChange}
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: 1,
                          '& .MuiFormControlLabel-root': {
                            margin: 0,
                            flex: 1,
                          },
                        }}
                      >
                        {Object.entries(strategyData).map(([key, data]) => (
                          <motion.div
                            key={key}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <FormControlLabel
                              value={key}
                              control={
                                <Radio
                                  sx={{
                                    color: data.color,
                                    '&.Mui-checked': {
                                      color: data.color,
                                    },
                                  }}
                                />
                              }
                              label={
                                <Box
                                  sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    p: 1,
                                    borderRadius: 1,
                                    border: `1px solid ${data.color}`,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                      borderColor: data.color,
                                      bgcolor: `${data.color}10`,
                                    },
                                  }}
                                >
                                  <Box sx={{ color: data.color, mb: 0.5 }}>
                                    {data.icon}
                                  </Box>
                                  <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, color: data.color, fontSize: '0.8rem' }}
                                  >
                                    {data.label}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary', fontSize: '0.7rem' }}
                                  >
                                    {data.description}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{ color: data.color, mt: 0.5, fontSize: '0.7rem' }}
                                  >
                                    月化收益: {data.monthlyReturn}%
                                  </Typography>
                                </Box>
                              }
                              sx={{
                                width: '100%',
                                m: 0,
                              }}
                            />
                          </motion.div>
                        ))}
                      </RadioGroup>
                    </FormControl>
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
                  height: '100%',
                  background: '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                  border: '1px solid rgba(0, 255, 184, 0.2)',
                  borderRadius: '12px',
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
                    background: 'linear-gradient(45deg, transparent, rgba(0,255,184,0.03), transparent)',
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 255, 184, 0.2)',
                    '&::before': {
                      transform: 'translateX(100%)',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box
                    sx={{
                      textAlign: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: '#00FFB8',
                        fontWeight: 700,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        fontSize: '1.2rem',
                      }}
                    >
                      <TrendingUpIcon />
                      预计总收益
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        color: '#00FFB8',
                        fontWeight: 800,
                        mb: 1,
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        background: 'linear-gradient(45deg, #00FFB8 30%, #00CC93 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {calculateProfit.totalProfit.toLocaleString()} USDT
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        opacity: 0.8,
                        fontSize: '0.8rem',
                      }}
                    >
                      投资 {profitData.months} 个月后的总收益
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      textAlign: 'center',
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        color: '#00FFB8',
                        fontWeight: 700,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        fontSize: '1.2rem',
                      }}
                    >
                      <MoneyIcon />
                      最终金额
                    </Typography>
                    <Typography
                      variant="h2"
                      sx={{
                        color: '#00FFB8',
                        fontWeight: 800,
                        mb: 1,
                        fontSize: { xs: '1.8rem', md: '2.2rem' },
                        background: 'linear-gradient(45deg, #00FFB8 30%, #00CC93 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {calculateProfit.finalAmount.toLocaleString()} USDT
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'text.secondary',
                        opacity: 0.8,
                        mb: 2,
                        fontSize: '0.8rem',
                      }}
                    >
                      包含初始投资和所有收益
                    </Typography>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="contained"
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          bgcolor: '#00FFB8',
                          color: '#000',
                          py: 0.8,
                          fontSize: '0.9rem',
                          borderRadius: 2,
                          fontWeight: 600,
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)',
                            transform: 'translateX(-100%)',
                            transition: 'transform 0.6s ease',
                          },
                          '&:hover': {
                            bgcolor: '#00CC93',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 10px 20px rgba(0, 255, 184, 0.2)',
                            '&::before': {
                              transform: 'translateX(100%)',
                            },
                          },
                        }}
                      >
                        立即开始投资
                      </Button>
                    </motion.div>
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

export default ProfitSection; 