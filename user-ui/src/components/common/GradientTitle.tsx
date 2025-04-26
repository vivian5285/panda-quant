import React from 'react';
import { Typography, TypographyProps, useTheme, Box } from '@mui/material';

interface GradientTitleProps extends TypographyProps {
  title: string;
  subtitle?: string;
}

export const GradientTitle: React.FC<GradientTitleProps> = ({ title, subtitle, ...props }) => {
  const theme = useTheme();

  return (
    <Box>
      <Typography
        {...props}
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 1,
          ...props.sx
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}; 