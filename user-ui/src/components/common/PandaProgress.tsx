import React from 'react';
import {
  LinearProgress,
  CircularProgress,
  Typography,
  Box,
  useTheme,
  LinearProgressProps,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

export interface PandaProgressProps extends LinearProgressProps {
  value: number;
  animate?: boolean;
  variant?: 'determinate' | 'indeterminate' | 'buffer';
  type?: 'linear' | 'circular';
  size?: number | string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  label?: string;
  showValue?: boolean;
  glow?: boolean;
  thickness?: number;
}

const PandaProgress: React.FC<PandaProgressProps> = ({
  value,
  animate = true,
  variant = 'determinate',
  type = 'linear',
  size = type === 'linear' ? '100%' : 40,
  color = 'primary',
  label,
  showValue = false,
  glow = false,
  thickness = type === 'linear' ? 4 : 3.6,
  ...props
}) => {
  const theme = useTheme();

  const getProgressStyle = () => ({
    '& .MuiLinearProgress-bar': {
      borderRadius: theme.shape.borderRadius,
      background: themeUtils.createGradient(
        theme.palette[color].main,
        theme.palette[color].light
      ),
    },
    '& .MuiCircularProgress-circle': {
      stroke: `url(#${color}Gradient)`,
    },
    ...(glow && {
      boxShadow: `0 0 20px ${theme.palette[color].main}20`,
    }),
  });

  const progress = (
    <Box sx={{ position: 'relative', width: size, height: size }}>
      {type === 'linear' ? (
        <>
          {label && (
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {label}
            </Typography>
          )}
          <LinearProgress
            variant={variant}
            value={value}
            sx={getProgressStyle()}
            {...props}
          />
          {showValue && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, textAlign: 'right' }}
            >
              {`${Math.round(value)}%`}
            </Typography>
          )}
        </>
      ) : (
        <>
          <CircularProgress
            variant={variant === 'buffer' ? 'determinate' : variant}
            value={value}
            size={size}
            thickness={thickness}
            sx={getProgressStyle()}
            {...props}
          />
          {showValue && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
              >
                {`${Math.round(value)}%`}
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );

  if (!animate) {
    return progress;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {progress}
    </motion.div>
  );
};

export default PandaProgress; 