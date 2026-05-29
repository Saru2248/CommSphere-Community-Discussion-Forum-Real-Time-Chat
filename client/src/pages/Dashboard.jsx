import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, MessageSquare, Calendar, Tag, AlertCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { discussionService } from '../services/api';

const Dashboard = ({ currentUser }) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & search states
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  useEffect(() => {
    fetchDiscussions();
  }, [category, tag, activeSearch]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const data = await discussionService.getAll({
        category,
        tag,
        search: activeSearch,
      });
      setDiscussions(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not load community discussions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearch(searchTerm);
  };

  const clearFilters = () => {
    setCategory('');
    setTag('');
    setSearchTerm('');
    setActiveSearch('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Announcements': return 'bg-rose-500/10 text-rose-400 border border-rose-500/25';
      case 'Programming': return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25';
      case 'Technology': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/25';
      case 'Career Advice': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25';
      case 'Support': return 'bg-amber-500/10 text-amber-400 border border-amber-500/25';
      default: return 'bg-slate-500/10 text-slate-400 border border-slate-500/25';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Community Discussions</h1>
          <p className="text-slate-400 text-sm mt-1">Join the conversations, ask questions, and share knowledge in real time.</p>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button type="submit" className="absolute left-3 top-3 text-slate-500 hover:text-slate-350">
              <Search className="h-4.5 w-4.5" />
            </button>
          </form>

          <Link
            to="/create-discussion"
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/10 shrink-0"
          >
            <Plus className="h-4.5 w-4.5" />
            <span>Create Post</span>
          </Link>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <Sidebar
          selectedCategory={category}
          onSelectCategory={setCategory}
          selectedTag={tag}
          onSelectTag={setTag}
        />

        {/* Discussions Listing */}
        <main className="flex-1 space-y-4">
          
          {/* Filters info banner */}
          {(category || tag || activeSearch) && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <span>Active Filters:</span>
                {category && (
                  <span className="bg-indigo-950/45 border border-indigo-900/60 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Category: {category}
                  </span>
                )}
                {tag && (
                  <span className="bg-indigo-950/45 border border-indigo-900/60 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Tag: #{tag}
                  </span>
                )}
                {activeSearch && (
                  <span className="bg-indigo-950/45 border border-indigo-900/60 text-indigo-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
                    Search: "{activeSearch}"
                  </span>
                )}
              </div>
              
              <button
                onClick={clearFilters}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-350 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-950/20 border border-red-800 text-red-400 p-4 rounded-xl text-sm flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-slate-900/50 border border-slate-800/80 rounded-xl p-6 animate-pulse space-y-3">
                  <div className="h-4 bg-slate-800 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : discussions.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl py-16 text-center">
              <MessageSquare className="h-12 w-12 text-slate-700 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-300">No Discussions Found</h3>
              <p className="text-slate-500 text-sm mt-1 max-w-sm mx-auto">
                No discussion threads match your selected filters. Try searching for something else or create a new topic!
              </p>
              <button
                onClick={clearFilters}
                className="mt-4 text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 px-4 py-2 rounded-xl transition-all"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {discussions.map((disc) => (
                <div
                  key={disc._id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-6 shadow-md hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                    {/* Category Label */}
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider self-start ${getCategoryColor(disc.category)}`}>
                      {disc.category}
                    </span>

                    {/* Metadata */}
                    <div className="flex items-center space-x-3 text-xs text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(disc.createdAt)}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <Link to={`/discussion/${disc._id}`} className="block group">
                    <h2 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
                      {disc.title}
                    </h2>
                  </Link>

                  {/* Description snippet */}
                  <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {disc.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
                    {/* Creator avatar & username */}
                    <div className="flex items-center space-x-2">
                      <div
                        className="h-7 w-7 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase"
                        style={{ backgroundColor: disc.creator?.avatarColor || '#6366f1' }}
                      >
                        {disc.creator?.username?.charAt(0) || '?'}
                      </div>
                      <span className="text-xs font-semibold text-slate-300">
                        {disc.creator?.username || 'Deleted User'}
                      </span>
                    </div>

                    {/* Tags & Comments count */}
                    <div className="flex items-center space-x-4">
                      {disc.tags && disc.tags.length > 0 && (
                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400">
                          <Tag className="h-3.5 w-3.5 text-slate-500" />
                          <div className="flex gap-1">
                            {disc.tags.slice(0, 3).map((t, idx) => (
                              <span key={idx} className="hover:text-slate-200">
                                #{t}{idx < disc.tags.slice(0,3).length - 1 ? ',' : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <Link
                        to={`/discussion/${disc._id}`}
                        className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-indigo-400 bg-slate-950 border border-slate-800 hover:border-indigo-900/60 px-3 py-1.5 rounded-lg font-medium transition-all"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{disc.commentsCount || 0} Replies</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
