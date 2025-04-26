import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, TextField, Button, useTheme } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';
import { motion } from 'framer-motion';

const ContactPage: React.FC = () => {
  const theme = useTheme();
  
  const contactInfo = [
    {
      title: '总部地址',
      content: '1600 Amphitheatre Parkway, Mountain View, CA 94043, USA',
      icon: '📍',
      color: '#FF6B6B'
    },
    {
      title: '联系电话',
      content: '+1 (650) 253-0000',
      icon: '📞',
      color: '#4ECDC4'
    },
    {
      title: '电子邮箱',
      content: 'contact@pandaquant.com',
      icon: '📧',
      color: '#45B7D1'
    },
    {
      title: '工作时间',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM (PST)',
      icon: '⏰',
      color: '#96CEB4'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <GradientTitle
            title="联系我们"
            subtitle="随时为您提供支持"
            sx={{ 
              mb: 6,
              textAlign: 'center',
              '& .gradient-text': {
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                fontWeight: 700,
                letterSpacing: '0.02em'
              }
            }}
          />
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <PandaCard
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      opacity: 0.8
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      mb: 4,
                      position: 'relative',
                      display: 'inline-block',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '2px',
                        transform: 'scaleX(0.3)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease'
                      },
                      '&:hover:after': {
                        transform: 'scaleX(1)'
                      }
                    }}
                  >
                    联系方式
                  </Typography>
                  <Grid container spacing={4}>
                    {contactInfo.map((item, index) => (
                      <Grid item xs={12} key={index}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card 
                            sx={{ 
                              background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                              border: `1px solid ${item.color}20`,
                              borderRadius: 3,
                              transition: 'all 0.3s ease',
                              position: 'relative',
                              overflow: 'hidden',
                              padding: '24px',
                              '&:before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: `linear-gradient(45deg, ${item.color}10, transparent)`,
                                opacity: 0,
                                transition: 'opacity 0.3s ease'
                              },
                              '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: `0 10px 20px ${item.color}20`,
                                '&:before': {
                                  opacity: 1
                                }
                              }
                            }}
                          >
                            <CardContent sx={{ p: 0 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <motion.div
                                  whileHover={{ rotate: 360 }}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Box
                                    sx={{
                                      width: 70,
                                      height: 70,
                                      borderRadius: '20px',
                                      background: `linear-gradient(135deg, ${item.color}, ${item.color}80)`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      boxShadow: `0 4px 15px ${item.color}40`,
                                      position: 'relative',
                                      '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        top: -2,
                                        left: -2,
                                        right: -2,
                                        bottom: -2,
                                        borderRadius: '22px',
                                        background: `linear-gradient(135deg, ${item.color}40, transparent)`,
                                        zIndex: -1
                                      }
                                    }}
                                  >
                                    <Typography variant="h3" sx={{ color: 'white' }}>
                                      {item.icon}
                                    </Typography>
                                  </Box>
                                </motion.div>
                                <Box sx={{ flex: 1 }}>
                                  <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                      fontWeight: 600,
                                      color: theme.palette.text.primary,
                                      mb: 1.5,
                                      fontSize: '1.2rem',
                                      position: 'relative',
                                      display: 'inline-block',
                                      '&:after': {
                                        content: '""',
                                        position: 'absolute',
                                        bottom: -2,
                                        left: 0,
                                        width: '30px',
                                        height: '2px',
                                        background: item.color,
                                        opacity: 0.5,
                                        transition: 'width 0.3s ease'
                                      },
                                      '&:hover:after': {
                                        width: '100%'
                                      }
                                    }}
                                  >
                                    {item.title}
                                  </Typography>
                                  <Typography 
                                    variant="body1" 
                                    sx={{ 
                                      color: theme.palette.text.secondary,
                                      lineHeight: 1.8,
                                      fontSize: '1.1rem',
                                      transition: 'color 0.3s ease',
                                      '&:hover': {
                                        color: theme.palette.text.primary
                                      }
                                    }}
                                  >
                                    {item.content}
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    ))}
                  </Grid>
                </PandaCard>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div variants={itemVariants}>
                <PandaCard
                  sx={{
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      opacity: 0.8
                    },
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                      pointerEvents: 'none'
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                      mb: 4,
                      position: 'relative',
                      display: 'inline-block',
                      '&:after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '100%',
                        height: '3px',
                        background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        borderRadius: '2px',
                        transform: 'scaleX(0.3)',
                        transformOrigin: 'left',
                        transition: 'transform 0.3s ease'
                      },
                      '&:hover:after': {
                        transform: 'scaleX(1)'
                      }
                    }}
                  >
                    发送消息
                  </Typography>
                  <Box 
                    component="form" 
                    sx={{ 
                      mt: 2,
                      '& .MuiTextField-root': {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                            }
                          },
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: theme.palette.primary.main,
                              borderWidth: 2
                            }
                          }
                        }
                      }
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="姓名"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="邮箱"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="主题"
                          variant="outlined"
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="消息内容"
                          variant="outlined"
                          multiline
                          rows={4}
                          sx={{ mb: 2 }}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            variant="contained"
                            size="large"
                            fullWidth
                            sx={{
                              height: 50,
                              borderRadius: 2,
                              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              color: 'white',
                              fontWeight: 600,
                              fontSize: '1.1rem',
                              textTransform: 'none',
                              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                              '&:hover': {
                                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)'
                              }
                            }}
                          >
                            发送消息
                          </Button>
                        </motion.div>
                      </Grid>
                    </Grid>
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

export default ContactPage; 