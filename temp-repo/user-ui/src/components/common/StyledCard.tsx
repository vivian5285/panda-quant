import React from 'react';
import { Card, CardProps, useTheme } from '@mui/material';

export const StyledCard: React.FC<CardProps> = ({ children, ...props }) => {
  const theme = useTheme();

  return (
    <Card
      {...props}
      sx={{
        background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        borderRadius: 2,
        boxShadow: theme.shadows[10],
        overflow: 'hidden',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
        },
        ...props.sx
      }}
    >
      {children}
    </Card>
  );
}; 