
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Home, User, Settings, LogOut, Search, Moon, Sun, Bell, PlusSquare } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-card border-b border-border sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            SocialNest
          </Link>
          
          {/* Search Bar - Hide on mobile */}
          <form 
            onSubmit={handleSearch}
            className="hidden md:flex relative w-1/3"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </form>
          
          {/* Navigation */}
          <nav>
            <ul className="flex items-center space-x-1">
              <li>
                <Link to="/" className="p-2 rounded-md hover:bg-secondary flex items-center justify-center" title="Home">
                  <Home size={24} />
                </Link>
              </li>
              
              <li>
                <Link to="/reels" className="p-2 rounded-md hover:bg-secondary flex items-center justify-center" title="Reels">
                  <Bell size={24} />
                </Link>
              </li>
              
              <li>
                <Link to="/create" className="p-2 rounded-md hover:bg-secondary flex items-center justify-center" title="Create Post">
                  <PlusSquare size={24} />
                </Link>
              </li>
              
              {user && (
                <li>
                  <Link 
                    to={`/profile/${user.user_metadata?.username || 'me'}`} 
                    className="p-2 rounded-md hover:bg-secondary flex items-center justify-center"
                    title="Profile"
                  >
                    <User size={24} />
                  </Link>
                </li>
              )}
              
              <li>
                <button 
                  onClick={toggleTheme} 
                  className="p-2 rounded-md hover:bg-secondary flex items-center justify-center"
                  title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
                </button>
              </li>
              
              <li>
                <Link to="/settings" className="p-2 rounded-md hover:bg-secondary flex items-center justify-center" title="Settings">
                  <Settings size={24} />
                </Link>
              </li>
              
              {user && (
                <li>
                  <button 
                    onClick={handleLogout} 
                    className="p-2 rounded-md hover:bg-secondary flex items-center justify-center text-red-500"
                    title="Logout"
                  >
                    <LogOut size={24} />
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
