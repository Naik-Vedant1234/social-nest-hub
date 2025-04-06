
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Set default auth header for all requests
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get current user data
          const response = await api.get('/api/users/me');
          setUser(response.data);
        }
      } catch (err) {
        console.error('Auth check failed', err);
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Save token and set user
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/register', userData);
      const { token, user } = response.data;
      
      // Save token and set user
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Request password reset
  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
    } catch (err) {
      throw err;
    }
  };

  // Verify OTP and reset password
  const resetPassword = async (email, otp, newPassword) => {
    try {
      await api.post('/api/auth/reset-password', { email, otp, newPassword });
    } catch (err) {
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      await api.put('/api/users/password', { currentPassword, newPassword });
    } catch (err) {
      throw err;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading,
        error,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        changePassword,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
