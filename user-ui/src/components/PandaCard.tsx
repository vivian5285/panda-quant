import React from 'react';
import { motion } from 'framer-motion';
import { scaleIn } from '../animations';

interface PandaCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'elevation' | 'outlined';
}

export const PandaCard: React.FC<PandaCardProps> = ({ 
  children, 
  className = '',
  variant = 'elevation'
}) => {
  const baseClasses = 'bg-white rounded-lg p-6';
  const variantClasses = {
    elevation: 'shadow-lg',
    outlined: 'border border-gray-200'
  };

  return (
    <motion.div
      variants={scaleIn}
      initial="initial"
      animate="animate"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </motion.div>
  );
}; 