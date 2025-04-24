import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const PartnersPage: React.FC = () => {
  const partners = [
    {
      name: '交易所合作伙伴',
      description: '我们与多家知名交易所建立了战略合作关系，为用户提供更优质的交易体验。',
      partners: [
        { name: 'Binance', logo: '/partners/binance.png' },
        { name: 'Huobi', logo: '/partners/huobi.png' },
        { name: 'OKX', logo: '/partners/okx.png' },
      ],
    },
    {
      name: '技术合作伙伴',
      description: '我们与领先的技术公司合作，共同推动量化交易技术的发展。',
      partners: [
        { name: 'AWS', logo: '/partners/aws.png' },
        { name: 'Google Cloud', logo: '/partners/google-cloud.png' },
        { name: 'Alibaba Cloud', logo: '/partners/alibaba-cloud.png' },
      ],
    },
    {
      name: '金融合作伙伴',
      description: '我们与多家金融机构合作，为用户提供更全面的金融服务。',
      partners: [
        { name: 'Visa', logo: '/partners/visa.png' },
        { name: 'Mastercard', logo: '/partners/mastercard.png' },
        { name: 'PayPal', logo: '/partners/paypal.png' },
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
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          p: 2,
                          bgcolor: 'rgba(0, 255, 184, 0.05)',
                          borderRadius: 2,
                        }}
                      >
                        <Box
                          component="img"
                          src={partner.logo}
                          alt={partner.name}
                          sx={{
                            height: 60,
                            objectFit: 'contain',
                            mb: 1,
                          }}
                        />
                        <Typography variant="body2" color="text.secondary">
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

      <Footer />
    </Box>
  );
};

export default PartnersPage; 