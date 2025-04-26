import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const PartnersPage: React.FC = () => {
  const partners = [
    {
      name: '交易所合作伙伴',
      description: '我们与多家知名交易所建立了战略合作关系，为用户提供更优质的交易体验。',
      partners: [
        { 
          name: 'Binance', 
          url: 'https://www.binance.com'
        },
        { 
          name: 'Huobi', 
          url: 'https://www.huobi.com'
        },
        { 
          name: 'OKX', 
          url: 'https://www.okx.com'
        },
      ],
    },
    {
      name: '技术合作伙伴',
      description: '我们与领先的技术公司合作，共同推动量化交易技术的发展。',
      partners: [
        { 
          name: 'AWS', 
          url: 'https://aws.amazon.com'
        },
        { 
          name: 'Google Cloud', 
          url: 'https://cloud.google.com'
        },
        { 
          name: 'Alibaba Cloud', 
          url: 'https://www.alibabacloud.com'
        },
      ],
    },
    {
      name: '金融合作伙伴',
      description: '我们与多家金融机构合作，为用户提供更全面的金融服务。',
      partners: [
        { 
          name: 'Visa', 
          url: 'https://www.visa.com.cn'
        },
        { 
          name: 'Mastercard', 
          url: 'https://www.mastercard.com.cn'
        },
        { 
          name: 'PayPal', 
          url: 'https://www.paypal.com'
        },
      ],
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="合作伙伴"
          subtitle="携手共创未来"
          sx={{ mb: 6 }}
        />
        
        <Grid container spacing={4}>
          {partners.map((section, index) => (
            <Grid item xs={12} key={index}>
              <PandaCard>
                <Typography variant="h5" gutterBottom>
                  {section.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  {section.description}
                </Typography>
                <Grid container spacing={2}>
                  {section.partners.map((partner, idx) => (
                    <Grid item xs={12} sm={4} key={idx}>
                      <Box
                        component="a"
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 3,
                          bgcolor: 'rgba(0, 255, 184, 0.05)',
                          borderRadius: 2,
                          textDecoration: 'none',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                          },
                        }}
                      >
                        <Typography 
                          variant="h6" 
                          sx={{
                            textAlign: 'center',
                            fontWeight: 500,
                            color: 'text.primary',
                          }}
                        >
                          {partner.name}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </PandaCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default PartnersPage; 