import React, { ChangeEvent } from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

export interface PandaInputProps extends Omit<TextFieldProps, 'variant' | 'onChange'> {
  label?: string;
  value: string | number;
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  type?: string;
  placeholder?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  icon?: React.ReactNode;
  sx?: any;
  animate?: boolean;
}

const PandaInput: React.FC<PandaInputProps> = ({
  label,
  value,
  onChange,
  error,
  helperText,
  fullWidth = true,
  required = false,
  disabled = false,
  readOnly = false,
  type = 'text',
  placeholder,
  startIcon,
  endIcon,
  icon,
  sx,
  animate = true,
  ...props
}) => {
  const theme = useTheme();

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const input = (
    <TextField
      variant="outlined"
      label={label}
      value={value}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      required={required}
      disabled={disabled}
      type={type}
      placeholder={placeholder}
      InputProps={{
        readOnly,
        startAdornment: startIcon || icon ? (
          <InputAdornment position="start">{startIcon || icon}</InputAdornment>
        ) : undefined,
        endAdornment: endIcon ? (
          <InputAdornment position="end">{endIcon}</InputAdornment>
        ) : undefined,
        sx: {
          height: 48,
          borderRadius: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
          '&.Mui-focused': {
            backgroundColor: 'rgba(255, 255, 255, 1)',
          },
          '& input': {
            color: '#333333',
            '&::placeholder': {
              color: '#666666',
            },
          },
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.divider,
            borderRadius: '8px',
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
          '&.Mui-focused': {
            color: theme.palette.primary.main,
          },
        },
        '& .MuiInputBase-input': {
          padding: '12px 16px',
          fontSize: '0.95rem',
          color: '#333333',
          '&:focus': {
            color: '#333333',
          },
        },
        ...sx,
      }}
      {...props}
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