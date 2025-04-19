import React from 'react';
import {
  LinearProgress,
  CircularProgress,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

interface PandaProgressProps {
  value?: number;
  variant?: 'determinate' | 'indeterminate' | 'buffer';
  type?: 'linear' | 'circular';
  size?: number | string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  label?: string;
  showValue?: boolean;
  animate?: boolean;
  glow?: boolean;
  thickness?: number;
}

export const PandaProgress: React.FC<PandaProgressProps> = ({
  value = 0,
  variant = 'determinate',
  type = 'linear',
  size = type === 'linear' ? '100%' : 40,
  color = 'primary',
  label,
  showValue = false,
  animate = true,
  glow = false,
  thickness = type === 'linear' ? 4 : 3.6,
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

  const getAnimation = () => {
    if (!animate) return {};

    return {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    };
  };

  return (
    <motion.div {...getAnimation()}>
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
    </motion.div>
  );
}; 