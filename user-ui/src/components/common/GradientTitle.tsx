import React from 'react';
import { Typography, TypographyProps, useTheme } from '@mui/material';

export const GradientTitle: React.FC<TypographyProps> = ({ children, ...props }) => {
  const theme = useTheme();

  return (
    <Typography
      {...props}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
        mb: 3,
        ...props.sx
      }}
    >
      {children}
    </Typography>
  );
}; 