import React, { ChangeEvent } from 'react';
import { TextField, TextFieldProps } from '@mui/material';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

export interface PandaInputProps extends Omit<TextFieldProps, 'variant'> {
  label?: string;
  value: string | number;
  onChange: (value: string | number) => void;
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const input = (
    <TextField
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
        startAdornment: startIcon || icon,
        endAdornment: endIcon,
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