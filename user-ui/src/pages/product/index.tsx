import React from 'react';
import { Box, Container, Typography, Grid, Button, Paper, Stepper, Step, StepLabel, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import GlobalBackground from '@/components/common/GlobalBackground';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';
import { fadeIn, slideUp, staggerChildren } from '@/animations';
import { 
  TrendingUp as TrendingUpIcon,
  GridView as GridViewIcon,
  Bolt as BoltIcon,
  AutoGraph as AutoGraphIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Star as StarIcon,
} from '@mui/icons-material';

const ProductPage: React.FC = () => {
  const strategies = [
    {
      name: '超级趋势策略',
      description: '基于ATR指标的动态趋势跟踪策略，自动适应市场波动。',
      performance: '月化收益50%-300%',
      risk: '中等',
      category: '趋势跟踪',
      features: ['自动趋势识别', '动态止损', '多时间框架分析'],
      icon: TrendingUpIcon,
      color: '#00FFB8'
    },
    {
      name: '网格交易策略',
      description: '在价格区间内设置网格，利用价格波动获取收益。',
      performance: '月化收益50%-300%',
      risk: '低',
      category: '区间交易',
      features: ['自动网格布局', '智能加仓', '风险分散'],
      icon: GridViewIcon,
      color: '#00B8FF'
    },
    {
      name: '动量突破策略',
      description: '捕捉价格突破关键位后的动量行情，适合趋势启动阶段。',
      performance: '月化收益50%-300%',
      risk: '中等',
      category: '突破交易',
      features: ['突破点识别', '动量追踪', '快速响应'],
      icon: BoltIcon,
      color: '#FFB800'
    },
  ];

  const productFeatures = [
    {
      title: '策略特点',
      items: ['自动交易', '风险控制', '收益分析', '实时监控', '参数优化'],
      icon: AutoGraphIcon,
      color: '#00FFB8'
    },
    {
      title: '使用流程',
      items: ['选择策略', '设置参数', '开始交易', '监控收益', '优化调整'],
      icon: SettingsIcon,
      color: '#00B8FF'
    }
  ];

  const usageSteps = [
    {
      title: '注册账户',
      description: '完成邮箱验证和身份认证',
      icon: AccountCircleIcon
    },
    {
      title: '选择策略',
      description: '根据风险偏好选择适合的策略',
      icon: AutoGraphIcon
    },
    {
      title: '设置参数',
      description: '自定义交易参数和风险控制',
      icon: SettingsIcon
    },
    {
      title: '开始交易',
      description: '启动自动交易系统',
      icon: PlayArrowIcon
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div variants={fadeIn}>
            <Box sx={{ 
              mb: 6, 
              textAlign: 'center',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0, 255, 184, 0.3), transparent)',
              }
            }}>
              <GradientTitle>
                高收益交易策略
              </GradientTitle>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mt: 1,
                  color: 'rgba(0, 0, 0, 0.8)',
                  fontSize: '1.1rem',
                }}
              >
                月化收益50%-300%，我们只收取收益的10%
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {strategies.map((strategy, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div variants={slideUp}>
                  <PandaCard
                    gradient
                    animation
                    sx={{ height: '100%' }}
                  >
                    <Box sx={{ 
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}>
                      <Box>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 2,
                          mb: 2,
                        }}>
                          <strategy.icon sx={{ 
                            fontSize: '2.5rem', 
                            color: strategy.color,
                            filter: 'drop-shadow(0 0 10px rgba(0, 255, 184, 0.3))'
                          }} />
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 600,
                              color: strategy.color,
                            }}>
                              {strategy.name}
                            </Typography>
                            <Chip 
                              label={strategy.category}
                              size="small"
                              sx={{ 
                                bgcolor: `${strategy.color}20`,
                                color: strategy.color,
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          mb: 2,
                          lineHeight: 1.6,
                        }}>
                          {strategy.description}
                        </Typography>
                        <Box sx={{ mb: 2 }}>
                          {strategy.features.map((feature, idx) => (
                            <Box 
                              key={idx} 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center',
                                gap: 1,
                                mb: 1,
                              }}
                            >
                              <CheckCircleIcon sx={{ 
                                fontSize: '1rem', 
                                color: strategy.color,
                              }} />
                              <Typography variant="body2" sx={{ 
                                color: 'rgba(0, 0, 0, 0.8)',
                              }}>
                                {feature}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      <Box>
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center', 
                          mb: 2,
                          p: 1.5,
                          bgcolor: 'rgba(0, 255, 184, 0.05)',
                          borderRadius: 1,
                        }}>
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(0, 0, 0, 0.8)',
                            fontWeight: 500,
                          }}>
                            {strategy.performance}
                          </Typography>
                          <Typography variant="body2" sx={{ 
                            color: 'rgba(0, 0, 0, 0.8)',
                            fontWeight: 500,
                          }}>
                            风险等级：{strategy.risk}
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          fullWidth
                          sx={{
                            bgcolor: strategy.color,
                            color: 'white',
                            '&:hover': {
                              bgcolor: `${strategy.color}CC`,
                              transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s',
                          }}
                        >
                          了解更多
                        </Button>
                      </Box>
                    </Box>
                  </PandaCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4} sx={{ mb: 6 }}>
            {productFeatures.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div variants={slideUp}>
                  <PandaCard
                    gradient
                    animation
                  >
                    <Box sx={{ p: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        mb: 3,
                      }}>
                        <feature.icon sx={{ 
                          fontSize: '2.5rem', 
                          color: feature.color,
                          filter: 'drop-shadow(0 0 10px rgba(0, 255, 184, 0.3))'
                        }} />
                        <Typography variant="h5" sx={{ 
                          fontWeight: 600,
                          color: feature.color,
                        }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 2 }}>
                        {feature.items.map((item, idx) => (
                          <Box 
                            key={idx} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              gap: 1,
                              mb: 1.5,
                              p: 1.5,
                              bgcolor: 'rgba(0, 255, 184, 0.05)',
                              borderRadius: 1,
                              transition: 'all 0.3s',
                              '&:hover': {
                                bgcolor: 'rgba(0, 255, 184, 0.08)',
                                transform: 'translateX(5px)',
                              }
                            }}
                          >
                            <StarIcon sx={{ 
                              fontSize: '1rem', 
                              color: feature.color,
                            }} />
                            <Typography variant="body1" sx={{ 
                              color: 'rgba(0, 0, 0, 0.8)',
                            }}>
                              {item}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </PandaCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ mb: 6 }}>
            <motion.div variants={fadeIn}>
              <Typography variant="h4" gutterBottom align="center" sx={{ 
                color: '#00FFB8',
                fontWeight: 600,
                mb: 4,
              }}>
                使用流程
              </Typography>
            </motion.div>
            <Stepper orientation="vertical" sx={{ mt: 4 }}>
              {usageSteps.map((step, index) => (
                <Step key={index} active={true}>
                  <motion.div variants={slideUp}>
                    <StepLabel
                      StepIconProps={{
                        icon: <step.icon sx={{ color: '#00FFB8' }} />,
                      }}
                    >
                      <Typography variant="h6" sx={{ 
                        color: 'rgba(0, 0, 0, 0.8)',
                        fontWeight: 500,
                      }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        color: 'rgba(0, 0, 0, 0.6)',
                        mt: 0.5,
                      }}>
                        {step.description}
                      </Typography>
                    </StepLabel>
                  </motion.div>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  gradient
                  animation
                >
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      mb: 2,
                    }}>
                      <AutoGraphIcon sx={{ 
                        fontSize: '2.5rem', 
                        color: '#00FFB8',
                        filter: 'drop-shadow(0 0 10px rgba(0, 255, 184, 0.3))'
                      }} />
                      <Typography variant="h5" sx={{ 
                        fontWeight: 600,
                        color: '#00FFB8',
                      }}>
                        策略定制服务
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(0, 0, 0, 0.6)',
                      lineHeight: 1.6,
                    }}>
                      根据您的投资目标和风险偏好，为您定制专属的交易策略，月化收益可达50%-300%。
                    </Typography>
                  </Box>
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  gradient
                  animation
                >
                  <Box sx={{ p: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      mb: 2,
                    }}>
                      <SecurityIcon sx={{ 
                        fontSize: '2.5rem', 
                        color: '#00FFB8',
                        filter: 'drop-shadow(0 0 10px rgba(0, 255, 184, 0.3))'
                      }} />
                      <Typography variant="h5" sx={{ 
                        fontWeight: 600,
                        color: '#00FFB8',
                      }}>
                        实时监控系统
                      </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ 
                      color: 'rgba(0, 0, 0, 0.6)',
                      lineHeight: 1.6,
                    }}>
                      24/7实时监控系统，确保您的交易安全，及时响应市场变化，最大化您的收益。
                    </Typography>
                  </Box>
                </PandaCard>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ProductPage; 