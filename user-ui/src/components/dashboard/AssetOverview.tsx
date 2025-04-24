import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Grid } from '@mui/material';
import { fadeIn } from '../../animations';
import { AssetData } from '../../services/dashboardService';

export interface AssetOverviewProps {
  assets: AssetData;
}

const AssetOverview: React.FC<AssetOverviewProps> = ({ assets }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={fadeIn}
    >
      <Grid container spacing={2}>
        {Object.entries(assets.currencies).map(([currency, data], index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Box
              sx={{
                p: 2,
                borderRadius: 1,
                bgcolor: 'background.paper',
                boxShadow: 1
              }}
            >
              <Typography variant="subtitle1" color="text.secondary">
                {currency}
              </Typography>
              <Typography variant="h6">
                {data.amount.toLocaleString()}
              </Typography>
              <Typography variant="body2" color={data.change24h >= 0 ? 'success.main' : 'error.main'}>
                {data.change24h >= 0 ? '+' : ''}{data.change24h}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${data.valueInUSD.toLocaleString()}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
};

export default AssetOverview; 