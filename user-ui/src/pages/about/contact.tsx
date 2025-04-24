import React from 'react';
import { Box, Container, Typography, Grid, TextField, Button } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const ContactPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="联系我们"
          subtitle="我们随时为您提供帮助和支持"
          sx={{ mb: 6 }}
        />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <PandaCard>
              <Typography variant="h5" gutterBottom>
                联系方式
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>邮箱：</strong> support@pandaquant.com
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>Telegram：</strong> @pandaquant
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  <strong>地址：</strong> 上海市浦东新区张江高科技园区
                </Typography>
              </Box>
            </PandaCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <PandaCard>
              <Typography variant="h5" gutterBottom>
                发送消息
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="您的姓名"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="邮箱地址"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="主题"
                  variant="outlined"
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="消息内容"
                  variant="outlined"
                  margin="normal"
                  multiline
                  rows={4}
                />
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    bgcolor: '#00FFB8',
                    '&:hover': {
                      bgcolor: '#00CC93',
                    },
                  }}
                >
                  发送消息
                </Button>
              </Box>
            </PandaCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default ContactPage; 