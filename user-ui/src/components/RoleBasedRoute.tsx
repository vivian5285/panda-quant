import React from 'react';
import { Navigate } from 'react-router-dom';
import { Stepper, Step, StepLabel } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.role || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return (
    <>
      <Stepper activeStep={allowedRoles.indexOf(user.role)} sx={{ mb: 3 }}>
        {allowedRoles.map((role, index) => (
          <Step key={index} completed={allowedRoles.indexOf(user.role) >= index}>
            <StepLabel>{role}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {children}
    </>
  );
};

export default RoleBasedRoute; 