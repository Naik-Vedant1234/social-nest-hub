
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, User, Settings, Film, Users, LogOut, Menu, X, Sun, Moon, PlusSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navItems = [
    { title: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { title: 'Create', path: '/create', icon: <PlusSquare className="w-5 h-5" /> },
    { title: 'Profile', path: `/profile/${user?.username}`, icon: <User className="w-5 h-5" /> },
    { title: 'Reels', path: '/reels', icon: <Film className="w-5 h-5" /> },
    { title: 'Followers', path: '/followers', icon: <Users className="w-5 h-5" /> },
    { title: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-primary">SocialNest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center space-x-1 text-sm font-medium hover:text-primary transition-colors"
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* User Menu */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-sm font-medium">Hi, {user.username}</div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                >
                  {item.icon}
                  <span>{item.title}</span>
                </Link>
              ))}
              
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 hover:text-primary transition-colors"
                  >
                    {theme === 'dark' ? (
                      <>
                        <Sun className="w-5 h-5" />
                        <span>Light Mode</span>
                      </>
                    ) : (
                      <>
                        <Moon className="w-5 h-5" />
                        <span>Dark Mode</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-500"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
