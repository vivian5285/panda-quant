import React from 'react';
import { TextField, InputAdornment, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export interface PandaInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  fullWidth?: boolean;
  error?: boolean;
  helperText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  autoFocus?: boolean;
  animate?: boolean;
  sx?: any;
  readOnly?: boolean;
  icon?: React.ReactNode;
}

const PandaInput: React.FC<PandaInputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  fullWidth = false,
  error = false,
  helperText,
  startIcon,
  endIcon,
  disabled = false,
  multiline = false,
  rows = 1,
  placeholder,
  autoFocus = false,
  animate = true,
  sx,
  readOnly = false,
  icon,
}) => {
  const theme = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const input = (
    <TextField
      label={label}
      value={value}
      onChange={handleChange}
      type={type}
      required={required}
      fullWidth={fullWidth}
      error={error}
      helperText={helperText}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      placeholder={placeholder}
      autoFocus={autoFocus}
      readOnly={readOnly}
      InputProps={{
        startAdornment: (startIcon || icon) && (
          <InputAdornment position="start">
            {startIcon || icon}
          </InputAdornment>
        ),
        endAdornment: endIcon && (
          <InputAdornment position="end">
            {endIcon}
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: '48px',
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          transition: 'all 0.3s ease',
          '&:hover fieldset': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: error ? theme.palette.error.main : theme.palette.primary.main,
          },
        },
        '& .MuiInputBase-input': {
          color: error ? theme.palette.error.main : '#00FFB8',
        },
        ...sx,
      }}
    />
  );

  if (!animate) {
    return input;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {input}
    </motion.div>
  );
};

export default PandaInput; 