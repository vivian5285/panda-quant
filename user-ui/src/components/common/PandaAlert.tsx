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
  message?: React.ReactNode;
  children?: React.ReactNode;
  variant?: 'standard' | 'filled' | 'outlined';
  onClose?: () => void;
  closable?: boolean;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  animate?: boolean;
  glow?: boolean;
  sx?: any;
}

const PandaAlert: React.FC<PandaAlertProps> = ({
  severity = 'info',
  title,
  message,
  children,
  variant = 'standard',
  onClose,
  closable = true,
  icon,
  action,
  animate = true,
  glow = false,
  sx,
}) => {
  const theme = useTheme();

  const getAlertStyle = () => ({
    ...sx,
    ...(glow && {
      boxShadow: `0 0 20px ${theme.palette[severity].main}33`,
    }),
  });

  const getAnimation = () => {
    if (!animate) return {};
    return {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.3 },
    };
  };

  const alertContent = (
    <Alert
      severity={severity}
      variant={variant}
      onClose={closable ? onClose : undefined}
      icon={icon}
      action={action}
      sx={getAlertStyle()}
    >
      {title && <AlertTitle>{title}</AlertTitle>}
      {message || children}
    </Alert>
  );

  return animate ? (
    <motion.div {...getAnimation()}>{alertContent}</motion.div>
  ) : (
    alertContent
  );
};

export default PandaAlert; 