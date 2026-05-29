import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, AlertCircle } from 'lucide-react';
import { discussionService } from '../services/api';

const CATEGORIES = ['General', 'Technology', 'Programming', 'Career Advice', 'Announcements', 'Support'];

const CreateDiscussion = ({ currentUser }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // If user is not logged in, redirect to login
  React.useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !category) {
      setError('Please fill in all required fields');
      return;
    }

    if (title.length > 100) {
      setError('Title cannot exceed 100 characters');
      return;
    }

    // Process tags: split by comma, trim spaces, remove empty tags
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      setError('');
      setLoading(true);
      const data = await discussionService.create({
        title: title.trim(),
        description: description.trim(),
        category,
        tags,
      });
      navigate(`/discussion/${data._id}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to create discussion topic. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1.5 text-sm text-slate-400 hover:text-indigo-400 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-5 mb-6">
          <MessageSquare className="h-6 w-6 text-indigo-500" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">Start a New Topic</h1>
            <p className="text-slate-400 text-xs mt-0.5">Post your question or share your idea with the community.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-800 text-red-400 p-4 rounded-xl text-sm flex items-center space-x-2 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Topic Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="e.g. How to set up Socket.IO in a React/Express MERN application?"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Content / Details <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y"
              placeholder="Provide a detailed explanation of your topic..."
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Tags (Comma separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="e.g. React, SocketIO, MERN, WebDev"
            />
            <p className="text-[10px] text-slate-500 mt-1.5">
              Add tags separated by commas to help other members discover your topic.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-500/10 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Posting topic...' : 'Publish Topic'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateDiscussion;
