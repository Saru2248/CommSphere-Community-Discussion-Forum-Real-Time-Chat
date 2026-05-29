import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, FileText, CheckCircle, AlertCircle, Save } from 'lucide-react';
import { authService } from '../services/api';

const AVATAR_COLORS = [
  '#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6', 
  '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#14b8a6', 
  '#10b981', '#22c55e', '#eab308', '#f97316'
];

const Profile = ({ currentUser, onProfileUpdate }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarColor, setAvatarColor] = useState(currentUser?.avatarColor || AVATAR_COLORS[5]);
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is not logged in, redirect to login
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email) {
      setError('Username and Email are required');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      
      const payload = { username, email, bio, avatarColor };
      if (password) {
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        payload.password = password;
      }

      const updatedUser = await authService.updateProfile(payload);
      onProfileUpdate(updatedUser);
      setSuccess('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-center gap-6 border-b border-slate-800 pb-6 mb-6">
          {/* Avatar representation */}
          <div
            className="h-24 w-24 rounded-full flex items-center justify-center text-white font-bold text-4xl uppercase shadow-xl ring-4 ring-slate-850"
            style={{ backgroundColor: avatarColor }}
          >
            {username.charAt(0) || '?'}
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-2xl font-extrabold text-white">{username}</h1>
            <p className="text-indigo-400 text-sm">{email}</p>
            <p className="text-slate-500 text-xs mt-1">Manage your account profile details and settings</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800 text-red-400 p-4 rounded-xl text-sm flex items-center space-x-2 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-950/20 border border-green-800 text-green-400 p-4 rounded-xl text-sm flex items-center space-x-2 mb-6">
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-505 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-505 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Bio
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                <FileText className="h-5 w-5 text-slate-500" />
              </div>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-505 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                placeholder="Tell the community about yourself..."
              />
            </div>
          </div>

          {/* Password (if editing) */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              New Password (Leave blank to keep current)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Minimum 6 characters"
            />
          </div>

          {/* Avatar Color Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Customize Avatar Color
            </label>
            <div className="flex flex-wrap gap-2 py-1">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setAvatarColor(color)}
                  className={`w-6 h-6 rounded-full transition-transform active:scale-95 ${
                    avatarColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/10 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-4.5 w-4.5" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
