import React from 'react';
import {
  Alert,
  AlertTitle,
  Collapse,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';

interface PandaAlertProps {
  severity?: 'success' | 'info' | 'warning' | 'error';
  title?: string;
  message: string;
  variant?: 'standard' | 'filled' | 'outlined';
  onClose?: () => void;
  closable?: boolean;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  animate?: boolean;
  glow?: boolean;
  children?: React.ReactNode;
}

const PandaAlert: React.FC<PandaAlertProps> = ({
  severity = 'info',
  title,
  message,
  variant = 'standard',
  onClose,
  closable = true,
  icon,
  action,
  animate = true,
  glow = false,
}) => {
  const theme = useTheme();

  const getAlertStyle = () => ({
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      boxShadow: glow ? theme.shadows[4] : 'none',
    },
  });

  const getAnimation = () => {
    if (!animate) return {};

    return {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    };
  };

  return (
    <Collapse in={true}>
      <motion.div {...getAnimation()}>
        <Alert
          severity={severity}
          variant={variant}
          onClose={closable ? onClose : undefined}
          icon={icon}
          action={action}
          sx={getAlertStyle()}
        >
          {title && <AlertTitle>{title}</AlertTitle>}
          {message}
        </Alert>
      </motion.div>
    </Collapse>
  );
};

export default PandaAlert; 