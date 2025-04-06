
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Mail, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const { forgotPassword, resetPassword } = useAuth();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await forgotPassword(email);
      setOtpSent(true);
      toast.success('OTP sent to your email address');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await resetPassword(email, otp, newPassword);
      toast.success('Password reset successful!');
      // Redirect to login page
      window.location.href = '/login';
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{otpSent ? 'Reset Password' : 'Forgot Password'}</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {otpSent 
              ? 'Enter the OTP sent to your email and create a new password' 
              : 'Enter your email to receive a password reset OTP'}
          </p>
        </div>
        
        {!otpSent ? (
          <form className="mt-8 space-y-6" onSubmit={handleRequestOTP}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 input w-full"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center items-center space-x-2"
            >
              {isSubmitting ? (
                <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Send OTP</span>
                </>
              )}
            </button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm font-medium text-primary hover:text-primary/80">
                Back to login
              </Link>
            </div>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input w-full"
                  placeholder="Enter OTP from your email"
                />
              </div>
              
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input w-full"
                  placeholder="Enter new password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
