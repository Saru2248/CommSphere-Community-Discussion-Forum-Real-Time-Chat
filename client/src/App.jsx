import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateDiscussion from './pages/CreateDiscussion';
import DiscussionDetail from './pages/DiscussionDetail';
import Profile from './pages/Profile';
import { authService } from './services/api';
import { getSocket, disconnectSocket, initiateSocket } from './sockets/socket';
import { Bell, X } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Handle socket connection for global events if logged in
    if (currentUser) {
      const socket = initiateSocket(localStorage.getItem('token'));

      // Listen for global real-time notifications
      // For instance, when anyone broadcasts a global announcement or typing alert
      socket.on('global_notification', (data) => {
        showNotification(data.message);
      });
    } else {
      disconnectSocket();
    }

    return () => {
      const socket = getSocket();
      if (socket) {
        socket.off('global_notification');
      }
    };
  }, [currentUser]);

  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    showNotification(`Welcome back, ${userData.username}!`);
  };

  const handleRegisterSuccess = (userData) => {
    setCurrentUser(userData);
    showNotification(`Account created! Welcome ${userData.username}.`);
  };

  const handleProfileUpdate = (userData) => {
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    disconnectSocket();
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/35 selection:text-indigo-200">
        
        {/* Header Navigation */}
        <Navbar currentUser={currentUser} onLogout={handleLogout} />

        {/* Global Toast Notification */}
        {notification && (
          <div className="fixed bottom-5 right-5 z-50 animate-bounce">
            <div className="bg-indigo-600 border border-indigo-500 text-white rounded-xl shadow-2xl px-5 py-3.5 flex items-center space-x-3 max-w-sm">
              <Bell className="h-5 w-5 animate-pulse text-indigo-200 shrink-0" />
              <p className="text-sm font-semibold flex-1 leading-snug">{notification}</p>
              <button
                onClick={() => setNotification(null)}
                className="text-indigo-200 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <div className="flex-1 w-full">
          <Routes>
            {/* Dashboard / Threads listing */}
            <Route path="/" element={<Dashboard currentUser={currentUser} />} />

            {/* Auth routes */}
            <Route
              path="/login"
              element={
                !currentUser ? (
                  <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/register"
              element={
                !currentUser ? (
                  <Register onRegisterSuccess={handleRegisterSuccess} />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Discussion creation page */}
            <Route
              path="/create-discussion"
              element={
                currentUser ? (
                  <CreateDiscussion currentUser={currentUser} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Discussion Thread Details & chat tabs */}
            <Route
              path="/discussion/:id"
              element={<DiscussionDetail currentUser={currentUser} />}
            />

            {/* Profile configuration */}
            <Route
              path="/profile"
              element={
                currentUser ? (
                  <Profile currentUser={currentUser} onProfileUpdate={handleProfileUpdate} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch all redirects to Dashboard */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-6 text-center text-xs">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} CommSphere Discussion Platform. All rights reserved.</p>
            <p className="mt-1 text-slate-600">Built as a real-time full-stack Course Capstone Project.</p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;
