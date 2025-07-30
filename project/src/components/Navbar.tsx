import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="Plan2Protect Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-gray-900">Plan2Protect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/how-it-works"
              className={`text-sm font-medium transition-colors ${
                isActive('/how-it-works') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/features"
              className={`text-sm font-medium transition-colors ${
                isActive('/features') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className={`text-sm font-medium transition-colors ${
                isActive('/pricing') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`text-sm font-medium transition-colors ${
                isActive('/contact') 
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-1' 
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isAdmin ? (
                    <Link to="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                  ) : (
                    <Link to="/user-dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Dashboard
                    </Link>
                  )}
                  {isAdmin && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="inline h-4 w-4 mr-2" />
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="inline h-4 w-4 mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  to="/start-assessment"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Start Assessment
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link to="/how-it-works" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              How It Works
            </Link>
            <Link to="/features" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Features
            </Link>
            <Link to="/pricing" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Pricing
            </Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link to="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
              Contact
            </Link>
            {user ? (
              <>
                {isAdmin ? (
                  <Link to="/dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/user-dashboard" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                    My Dashboard
                  </Link>
                )}
                {isAdmin && (
                  <Link to="/admin" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600">
                  Login
                </Link>
                <Link to="/start-assessment" className="block px-3 py-2 text-base font-medium bg-blue-600 text-white rounded-md">
                  Start Assessment
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}