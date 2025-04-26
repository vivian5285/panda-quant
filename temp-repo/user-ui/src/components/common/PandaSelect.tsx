import React from 'react';
import {
  Select,
  SelectProps,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { themeUtils } from '../../theme';

export interface Option {
  value: string;
  label: string;
}

export interface PandaSelectProps extends Omit<SelectProps, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  animate?: boolean;
  placeholder?: string;
  size?: 'small' | 'medium';
  glow?: boolean;
  startIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const PandaSelect: React.FC<PandaSelectProps> = ({
  label,
  value,
  onChange,
  options,
  fullWidth = true,
  required = false,
  disabled = false,
  error = false,
  helperText,
  animate = true,
  placeholder,
  size = 'medium',
  glow = false,
  startIcon,
  children,
  ...props
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

  const select = (
    <FormControl
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      error={error}
      sx={getSelectStyle()}
    >
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        onChange={(e) => onChange(e.target.value as string)}
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
  );

  if (!animate) {
    return select;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {select}
    </motion.div>
  );
};

export default PandaSelect; 