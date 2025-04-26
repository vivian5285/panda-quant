import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  Paper,
  Divider,
} from '@mui/material';
import { 
  Security as SecurityIcon, 
  Lock as LockIcon, 
  VpnKey as VpnKeyIcon,
  Shield as ShieldIcon,
  VerifiedUser as VerifiedUserIcon,
  SecurityUpdateGood as SecurityUpdateGoodIcon,
  AccountBalance as AccountBalanceIcon,
  CloudSync as CloudSyncIcon,
  Verified as VerifiedIcon,
  GppGood as GppGoodIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PandaCard from '../components/common/PandaCard';
import { fadeIn, slideUp, staggerChildren } from '../animations';
import GlobalBackground from '../components/common/GlobalBackground';

const SecurityPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.98) 100%)',
      }}
    >
      <GlobalBackground />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div variants={fadeIn}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 6,
              gap: 2,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: 0,
                width: '100%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(0, 255, 184, 0.3), transparent)',
              }
            }}>
              <SecurityIcon sx={{ 
                fontSize: '3.5rem', 
                color: '#00FFB8',
                filter: 'drop-shadow(0 0 15px rgba(0, 255, 184, 0.5))'
              }} />
              <Box>
                <Typography
                  variant="h2"
                  sx={{
                    color: '#00FFB8',
                    fontWeight: 700,
                    fontSize: { xs: '2.2rem', md: '2.8rem' },
                    fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
                    textShadow: '0 0 15px rgba(0, 255, 184, 0.3)',
                    letterSpacing: '0.02em',
                  }}
                >
                  平台安全保障
                </Typography>
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: 'rgba(0, 0, 0, 0.8)',
                    fontSize: '1.1rem',
                    mt: 1,
                    letterSpacing: '0.01em',
                  }}
                >
                  全方位安全防护体系，为您的数字资产保驾护航
                </Typography>
              </Box>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldIcon sx={{ color: '#00FFB8' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#00FFB8' }}>资金安全保障</Typography>
                    </Box>
                  }
                  gradient
                  animation
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2.5,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <AccountBalanceIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          资金托管
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          用户资金由专业第三方托管机构保管，平台无法直接接触用户资金，确保资金安全
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <LockIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          冷热钱包分离
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          采用冷热钱包分离存储机制，95%资产存储在离线冷钱包，确保资金安全
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <VerifiedIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          多重签名机制
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          所有资金操作需要多重签名确认，防止单点风险，确保交易安全
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <VpnKeyIcon sx={{ color: '#00FFB8' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>交易所API安全</Typography>
                    </Box>
                  }
                  gradient
                  animation
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2.5,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <CloudSyncIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          API密钥加密存储
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          采用银行级AES-256加密技术，确保API密钥安全存储，防止泄露风险
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <SecurityUpdateGoodIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          权限最小化
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          严格遵循最小权限原则，仅申请必要的API权限，降低安全风险
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <VerifiedUserIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          实时监控
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          7×24小时实时监控API调用情况，及时发现并处理异常行为
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GppGoodIcon sx={{ color: '#00FFB8' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>交易安全</Typography>
                    </Box>
                  }
                  gradient
                  animation
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2.5,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <VerifiedUserIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          风控系统
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          智能风控系统实时监控交易行为，防范异常交易，保障交易安全
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <LockIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          交易限额
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          根据用户等级设置交易限额，有效控制风险敞口，保障资金安全
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <SecurityIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          交易确认
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          大额交易需要二次确认，防止误操作，确保交易安全可靠
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ShieldIcon sx={{ color: '#00FFB8' }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>系统安全</Typography>
                    </Box>
                  }
                  gradient
                  animation
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 2.5,
                  }}>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <ShieldIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          数据加密
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          采用AES-256加密算法，确保数据传输安全，防止信息泄露
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <SecurityUpdateGoodIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          系统防护
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          DDoS防护、WAF防火墙等多重防护措施，确保系统安全稳定运行
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2.5,
                      bgcolor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      '&:hover': {
                        bgcolor: 'rgba(0, 255, 184, 0.08)',
                        transform: 'translateY(-2px)',
                      }
                    }}>
                      <VerifiedUserIcon sx={{ 
                        color: '#00FFB8',
                        fontSize: '2rem',
                      }} />
                      <Box>
                        <Typography variant="body1" sx={{ 
                          color: 'rgba(0, 0, 0, 0.8)',
                          fontWeight: 500,
                          mb: 0.5,
                        }}>
                          安全审计
                        </Typography>
                        <Typography variant="body2" sx={{ 
                          color: 'rgba(0, 0, 0, 0.6)',
                          lineHeight: 1.6,
                        }}>
                          定期进行安全审计和渗透测试，持续提升系统安全性
                        </Typography>
                      </Box>
                    </Box>
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

export default SecurityPage; 