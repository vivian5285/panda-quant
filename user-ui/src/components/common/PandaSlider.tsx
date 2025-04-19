import React from 'react';
import { Slider, Typography, Box, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface PandaSliderProps {
  label?: string;
  value?: number | number[];
  onChange?: (value: number | number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  marks?: boolean | { value: number; label: string }[];
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium';
  animate?: boolean;
  glow?: boolean;
  showValue?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

const PandaSlider: React.FC<PandaSliderProps> = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  marks = false,
  disabled = false,
  error = false,
  helperText,
  color = 'primary',
  size = 'medium',
  animate = false,
  glow = false,
  showValue = false,
  orientation = 'horizontal',
}) => {
  const theme = useTheme();

  const getSliderStyle = () => {
    const baseStyle = {
      '& .MuiSlider-root': {
        color: theme.palette[color].main,
        height: size === 'small' ? 4 : 6,
        '& .MuiSlider-track': {
          border: 'none',
          transition: 'all 0.3s ease',
        },
        '& .MuiSlider-rail': {
          opacity: 0.3,
          backgroundColor: theme.palette.grey[300],
          transition: 'all 0.3s ease',
        },
        '& .MuiSlider-thumb': {
          width: size === 'small' ? 12 : 16,
          height: size === 'small' ? 12 : 16,
          backgroundColor: theme.palette.common.white,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
          '&:hover, &.Mui-focusVisible': {
            boxShadow: `0 0 0 8px ${theme.palette[color].main}20`,
          },
          '&.Mui-active': {
            boxShadow: `0 0 0 12px ${theme.palette[color].main}30`,
          },
        },
        '& .MuiSlider-mark': {
          backgroundColor: theme.palette.grey[400],
          width: 2,
          height: 2,
          borderRadius: '50%',
        },
        '& .MuiSlider-markLabel': {
          color: theme.palette.text.secondary,
          fontSize: '0.75rem',
        },
      },
    };

    if (glow) {
      return {
        ...baseStyle,
        '& .MuiSlider-root': {
          ...baseStyle['& .MuiSlider-root'],
          '& .MuiSlider-track': {
            ...baseStyle['& .MuiSlider-root']['& .MuiSlider-track'],
            boxShadow: `0 0 10px ${theme.palette[color].main}40`,
          },
        },
      };
    }

    return baseStyle;
  };

  const getAnimation = () => {
    if (!animate) return {};
    return {
      whileHover: {
        scale: 1.02,
        transition: { duration: 0.2 },
      },
    };
  };

  const formatValue = (value: number | number[]) => {
    if (Array.isArray(value)) {
      return value.join(' - ');
    }
    return value;
  };

  return (
    <motion.div {...getAnimation()}>
      <Box sx={{ width: orientation === 'vertical' ? 40 : '100%' }}>
        {label && (
          <Typography
            variant="body2"
            color={error ? 'error' : 'text.primary'}
            sx={{ mb: 1, fontWeight: 500 }}
          >
            {label}
          </Typography>
        )}
        <Slider
          value={value}
          onChange={(_, newValue) => onChange?.(newValue)}
          min={min}
          max={max}
          step={step}
          marks={marks}
          disabled={disabled}
          color={color}
          size={size}
          orientation={orientation}
          sx={getSliderStyle()}
        />
        {showValue && (
          <Typography
            variant="caption"
            color={error ? 'error' : 'text.secondary'}
            sx={{ mt: 1, textAlign: 'center' }}
          >
            {formatValue(value || 0)}
          </Typography>
        )}
        {helperText && (
          <Typography
            variant="caption"
            color={error ? 'error' : 'text.secondary'}
            sx={{ mt: 1 }}
          >
            {helperText}
          </Typography>
        )}
      </Box>
    </motion.div>
  );
};

export default PandaSlider; 