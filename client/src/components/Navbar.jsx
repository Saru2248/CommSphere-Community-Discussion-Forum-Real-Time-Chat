import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MessageSquare, LogOut, User, PlusCircle, LayoutDashboard } from 'lucide-react';
import { authService } from '../services/api';

const Navbar = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    onLogout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-indigo-400 hover:text-indigo-300 transition-colors">
              <MessageSquare className="h-8 w-8 text-indigo-500 animate-pulse" />
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                CommSphere
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive('/') 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/create-discussion"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive('/create-discussion') 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <PlusCircle className="h-4 w-4" />
                  <span>New Topic</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive('/profile') 
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>

                {/* User Avatar Circle */}
                <div className="flex items-center space-x-2 pl-2 border-l border-slate-800">
                  <div
                    className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold uppercase shadow-inner"
                    style={{ backgroundColor: currentUser.avatarColor || '#6366f1' }}
                    title={currentUser.username}
                  >
                    {currentUser.username.charAt(0)}
                  </div>
                  <span className="text-sm font-medium text-slate-300 hidden md:block">
                    {currentUser.username}
                  </span>
                  
                  <button
                    onClick={handleLogout}
                    className="p-1.5 rounded-full text-slate-400 hover:bg-red-950/30 hover:text-red-400 transition-colors ml-2"
                    title="Logout"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white hover:bg-indigo-500 px-4 py-2 rounded-md text-sm font-medium shadow-md shadow-indigo-500/10 transition-all hover:scale-[1.02]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
