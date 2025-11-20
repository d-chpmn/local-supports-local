import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificationAPI } from '../services/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Poll for notifications every 60 seconds
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (error) {
      console.error('Error fetching notification count:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between" style={{ height: '100px' }}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center py-3">
              <img 
                src="/assets/logo_LSL.png" 
                alt="Local Supports Local" 
                style={{ height: '90px', width: 'auto' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-primary hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/transactions/submit" className="text-primary hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Submit Transactions
                </Link>
                <Link to="/grant-applications" className="text-primary hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Grant Applications
                </Link>
                <Link to="/history" className="text-primary hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  History
                </Link>
                <Link to="/profile" className="text-primary hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Profile
                </Link>
                
                {/* Notifications */}
                <Link to="/dashboard" className="relative text-primary hover:text-secondary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-secondary rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                <div className="text-primary px-3 py-2 text-sm">
                  {user.first_name} {user.last_name}
                </div>
                
                <button
                  onClick={handleLogout}
                  className="bg-secondary text-primary hover:bg-secondary-dark px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/apply" className="bg-secondary text-primary hover:bg-secondary-dark px-6 py-3 rounded-md text-base font-semibold transition-colors shadow-md">
                  Apply for Grant
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary hover:text-secondary focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" className="text-primary hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Dashboard
                </Link>
                <Link to="/transactions/submit" className="text-primary hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Submit Transactions
                </Link>
                <Link to="/grant-applications" className="text-primary hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Grant Applications
                </Link>
                <Link to="/history" className="text-primary hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  History
                </Link>
                <Link to="/profile" className="text-primary hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-primary hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/apply" className="text-primary hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium">
                  Apply for Grant
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
