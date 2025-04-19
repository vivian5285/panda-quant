import React from 'react';
import { Checkbox, FormControlLabel, Typography, useTheme, FormHelperText, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface PandaCheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  error?: boolean;
  helperText?: string;
  color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'small' | 'medium';
  animate?: boolean;
  glow?: boolean;
}

const PandaCheckbox: React.FC<PandaCheckboxProps> = ({
  label,
  checked = false,
  onChange,
  disabled = false,
  required = false,
  error = false,
  helperText,
  color = 'primary',
  size = 'medium',
  animate = true,
  glow = false,
}) => {
  const theme = useTheme();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  const checkboxContent = (
    <Box sx={{ position: 'relative' }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            color={error ? 'error' : color}
            size={size}
            sx={{
              '&.Mui-checked': {
                color: error ? theme.palette.error.main : theme.palette[color].main,
              },
              ...(glow && checked && {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: '50%',
                  background: `${theme.palette[color].main}33`,
                  animation: 'pulse 1.5s ease-in-out infinite',
                },
              }),
            }}
          />
        }
        label={
          <Typography
            variant="body2"
            color={error ? 'error' : 'textPrimary'}
            sx={{
              ...(required && {
                '&::after': {
                  content: '" *"',
                  color: theme.palette.error.main,
                },
              }),
            }}
          >
            {label}
          </Typography>
        }
      />
      {helperText && (
        <FormHelperText error={error} sx={{ ml: 2 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );

  return animate ? (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {checkboxContent}
    </motion.div>
  ) : (
    checkboxContent
  );
};

export default PandaCheckbox; 