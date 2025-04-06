
import React from 'react';
import { Navigate } from 'react-router-dom';

// This component is a redirect for consistency in routes
// The actual reset functionality is handled in ForgotPassword.js
const ResetPassword = () => {
  return <Navigate to="/forgot-password" replace />;
};

export default ResetPassword;
