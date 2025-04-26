import React from 'react';
import { Switch, FormControlLabel, Typography, useTheme, FormHelperText, Box } from '@mui/material';
import { motion } from 'framer-motion';

interface PandaSwitchProps {
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

const PandaSwitch: React.FC<PandaSwitchProps> = ({
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

  const switchContent = (
    <Box sx={{ position: 'relative' }}>
      <FormControlLabel
        control={
          <Switch
            checked={checked}
            onChange={handleChange}
            disabled={disabled}
            required={required}
            color={error ? 'error' : color}
            size={size}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: error ? theme.palette.error.main : theme.palette[color].main,
                '& + .MuiSwitch-track': {
                  backgroundColor: error ? theme.palette.error.main : theme.palette[color].main,
                },
              },
              ...(glow && checked && {
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderRadius: '16px',
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
      {switchContent}
    </motion.div>
  ) : (
    switchContent
  );
};

export default PandaSwitch; 