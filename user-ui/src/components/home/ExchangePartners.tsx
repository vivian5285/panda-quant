import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const partners = [
  {
    name: 'Binance',
    logo: '/images/exchanges/binance.png',
  },
  {
    name: 'OKX',
    logo: '/images/exchanges/okx.png',
  },
  {
    name: 'Bitget',
    logo: '/images/exchanges/bitget.png',
  },
  {
    name: 'Gate.io',
    logo: '/images/exchanges/gate.png',
  },
  {
    name: 'Huobi',
    logo: '/images/exchanges/huobi.png',
  },
  {
    name: 'Bybit',
    logo: '/images/exchanges/bybit.png',
  },
];

const ExchangePartners: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        sx={{ mb: 4, fontWeight: 'bold' }}
      >
        交易所合作伙伴
      </Typography>
      <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={4}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 30,
            },
          }}
        >
          {partners.map((partner, index) => (
            <SwiperSlide key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={partner.logo}
                    alt={partner.name}
                    sx={{
                      height: 60,
                      objectFit: 'contain',
                      filter: 'grayscale(100%)',
                      opacity: 0.7,
                      transition: 'all 0.3s',
                      '&:hover': {
                        filter: 'grayscale(0%)',
                        opacity: 1,
                      },
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, color: 'text.secondary' }}
                  >
                    {partner.name}
                  </Typography>
                </Box>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};

export default ExchangePartners; 