import React from 'react';
import { Radio, FormControlLabel, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface PandaRadioProps {
  value: string | number;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  animate?: boolean;
}

export const PandaRadio: React.FC<PandaRadioProps> = ({
  value,
  label,
  checked,
  onChange,
  disabled = false,
  animate = true,
}) => {
  const theme = useTheme();

  const getRadioStyle = () => ({
    '& .MuiRadio-root': {
      color: theme.palette.primary.main,
      '&.Mui-checked': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiFormControlLabel-label': {
      color: theme.palette.text.primary,
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
    <motion.div {...getAnimation()}>
      <FormControlLabel
        control={
          <Radio
            checked={checked}
            onChange={onChange}
            value={value}
            disabled={disabled}
          />
        }
        label={<Typography>{label}</Typography>}
        sx={getRadioStyle()}
      />
    </motion.div>
  );
};

export default PandaRadio; 