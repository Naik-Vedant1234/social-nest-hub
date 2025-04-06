
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Layout from '../components/Layout';
import { toast } from 'sonner';
import { Lock, Sun, Moon, LogOut, User, Shield } from 'lucide-react';

const Settings = () => {
  const { logout, changePassword, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [activeTab, setActiveTab] = useState('account');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password changed successfully');
      
      // Clear the form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
          {/* Sidebar */}
          <div className="bg-card rounded-lg p-4 h-fit">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('account')}
                className={`flex items-center space-x-2 w-full p-3 rounded-md transition-colors ${activeTab === 'account' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </button>
              
              <button
                onClick={() => setActiveTab('security')}
                className={`flex items-center space-x-2 w-full p-3 rounded-md transition-colors ${activeTab === 'security' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
              >
                <Shield className="h-5 w-5" />
                <span>Security</span>
              </button>
              
              <button
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center space-x-2 w-full p-3 rounded-md transition-colors ${activeTab === 'appearance' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'}`}
              >
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span>Appearance</span>
              </button>
              
              <hr className="border-border" />
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 w-full p-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
          
          {/* Content */}
          <div className="bg-card rounded-lg p-6">
            {activeTab === 'account' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Username</label>
                    <input 
                      type="text" 
                      readOnly 
                      value={user?.username || ''} 
                      className="input w-full max-w-md bg-secondary/50" 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input 
                      type="email" 
                      readOnly 
                      value={user?.email || ''} 
                      className="input w-full max-w-md bg-secondary/50" 
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                      Current Password
                    </label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      required
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      required
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="input w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      required
                      value={passwordData.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="input w-full"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary flex items-center space-x-2"
                  >
                    {isSubmitting ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <Lock className="h-5 w-5" />
                        <span>Change Password</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
            
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                <div className="space-y-6">
                  <div>
                    <p className="text-sm mb-2">Theme Mode</p>
                    <div className="flex space-x-4">
                      <button
                        onClick={() => theme === 'dark' && toggleTheme()}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                          theme === 'light' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary border border-border'
                        }`}
                      >
                        <Sun className="h-5 w-5" />
                        <span>Light</span>
                      </button>
                      
                      <button
                        onClick={() => theme === 'light' && toggleTheme()}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                          theme === 'dark' 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-secondary border border-border'
                        }`}
                      >
                        <Moon className="h-5 w-5" />
                        <span>Dark</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
