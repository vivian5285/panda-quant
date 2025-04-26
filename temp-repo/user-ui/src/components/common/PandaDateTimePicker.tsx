import React from 'react';
import { useTheme } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { motion } from 'framer-motion';

interface PandaDateTimePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  animate?: boolean;
  glow?: boolean;
}

export const PandaDateTimePicker: React.FC<PandaDateTimePickerProps> = ({
  value,
  onChange,
  label,
  placeholder,
  disabled = false,
  error = false,
  helperText,
  animate = true,
  glow = false,
}) => {
  const theme = useTheme();

  const getDateTimePickerStyle = () => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.shape.borderRadius,
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        boxShadow: glow ? theme.shadows[4] : 'none',
      },
      '&.Mui-focused': {
        boxShadow: glow ? theme.shadows[8] : theme.shadows[2],
      },
    },
  });

  const getAnimation = () => {
    if (!animate) return {};

    return {
      whileHover: { scale: 1.02 },
      whileTap: { scale: 0.98 },
    };
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <motion.div {...getAnimation()}>
        <DateTimePicker
          value={value}
          onChange={onChange}
          disabled={disabled}
          slotProps={{
            textField: {
              label,
              placeholder,
              error,
              helperText,
              sx: getDateTimePickerStyle(),
            },
          }}
        />
      </motion.div>
    </LocalizationProvider>
  );
}; 