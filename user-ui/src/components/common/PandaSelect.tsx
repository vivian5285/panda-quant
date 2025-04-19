import React from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface PandaSelectProps {
  value: string | number;
  onChange: (value: string | number) => void;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  animate?: boolean;
  glow?: boolean;
  startIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const PandaSelect: React.FC<PandaSelectProps> = ({
  value,
  onChange,
  options,
  label,
  placeholder,
  disabled = false,
  required = false,
  error = false,
  helperText,
  fullWidth = true,
  size = 'medium',
  animate = false,
  glow = false,
  startIcon,
  children,
}) => {
  const theme = useTheme();

  const getSelectStyle = () => {
    const baseStyle = {
      '& .MuiOutlinedInput-root': {
        background: themeUtils.createGradient(
          theme.palette.background.paper,
          theme.palette.background.default
        ),
        borderRadius: theme.shape.borderRadius,
        transition: 'all 0.3s ease',
        '&:hover': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        },
        '&.Mui-focused': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
            borderWidth: 2,
          },
        },
        '&.Mui-error': {
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main,
          },
        },
      },
      '& .MuiSelect-select': {
        padding: size === 'small' ? theme.spacing(1, 2) : theme.spacing(1.5, 2),
      },
      '& .MuiInputLabel-root': {
        color: theme.palette.text.secondary,
        '&.Mui-focused': {
          color: theme.palette.primary.main,
        },
        '&.Mui-error': {
          color: theme.palette.error.main,
        },
      },
      '& .MuiMenuItem-root': {
        padding: theme.spacing(1.5, 2),
        transition: 'all 0.2s ease',
        '&:hover': {
          background: themeUtils.createGradient(
            theme.palette.primary.main,
            theme.palette.primary.dark
          ),
          color: theme.palette.primary.contrastText,
        },
      },
    };

    if (glow) {
      return {
        ...baseStyle,
        '& .MuiOutlinedInput-root': {
          ...baseStyle['& .MuiOutlinedInput-root'],
          boxShadow: `0 0 20px ${theme.palette.primary.main}20`,
        },
      };
    }

    return baseStyle;
  };

  const getAnimation = () => {
    if (!animate) return {};
    return {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 10 },
      transition: { duration: 0.3 },
    };
  };

  return (
    <motion.div {...getAnimation()}>
      <FormControl
        fullWidth={fullWidth}
        size={size}
        disabled={disabled}
        required={required}
        error={error}
        sx={getSelectStyle()}
      >
        {label && <InputLabel>{label}</InputLabel>}
        <Select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          label={label}
          placeholder={placeholder}
          MenuProps={{
            PaperProps: {
              sx: {
                background: themeUtils.createGradient(
                  theme.palette.background.paper,
                  theme.palette.background.default
                ),
                boxShadow: theme.shadows[24],
                borderRadius: theme.shape.borderRadius * 2,
                '& .MuiMenuItem-root': {
                  padding: theme.spacing(1.5, 2),
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: themeUtils.createGradient(
                      theme.palette.primary.main,
                      theme.palette.primary.dark
                    ),
                    color: theme.palette.primary.contrastText,
                  },
                },
              },
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <Typography
            variant="caption"
            color={error ? 'error' : 'text.secondary'}
            sx={{ mt: 1 }}
          >
            {helperText}
          </Typography>
        )}
      </FormControl>
    </motion.div>
  );
};

export default PandaSelect; 