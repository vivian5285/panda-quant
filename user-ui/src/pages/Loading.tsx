import React from 'react';
import { Box, Container, CircularProgress } from '@mui/material';
import { GradientTitle } from '../components/common/GradientTitle';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { slideUp } from '../animations';

const Loading: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <motion.div variants={slideUp}>
          <GradientTitle 
            title={t('loading.title', '加载中...')} 
            variant="h4" 
            align="center"
          >
            {t('loading.title', '加载中...')}
          </GradientTitle>
        </motion.div>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={60} />
      </Box>
    </Container>
  );
};

export default Loading; 