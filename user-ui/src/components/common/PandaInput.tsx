import React, { ChangeEvent } from 'react';
import { TextField, TextFieldProps, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

export interface PandaInputProps extends Omit<TextFieldProps, 'variant' | 'onChange'> {
  label?: string;
  value: string | number;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
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

  const input = (
    <TextField
      label={label}
      value={value}
      onChange={onChange}
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
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
          '&.Mui-focused': {
            backgroundColor: theme.palette.background.paper,
          },
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.divider,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
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