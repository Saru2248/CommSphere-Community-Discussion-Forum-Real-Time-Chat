import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Calendar, MessageSquare, Trash2, Tag, HelpCircle, Users } from 'lucide-react';
import CommentSection from '../components/CommentSection';
import RealtimeChatSection from '../components/RealtimeChatSection';
import { discussionService } from '../services/api';

const DiscussionDetail = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('replies'); // 'replies' or 'chat'

  useEffect(() => {
    fetchDiscussionDetails();
  }, [id]);

  const fetchDiscussionDetails = async () => {
    try {
      setLoading(true);
      const data = await discussionService.getById(id);
      setDiscussion(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load discussion details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (!window.confirm('WARNING: Deleting this topic will permanently erase all replies and live chat history. Are you sure?')) return;

    try {
      await discussionService.delete(id);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Failed to delete discussion thread.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !discussion) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <HelpCircle className="h-12 w-12 text-slate-700 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-200">Discussion Not Found</h2>
        <p className="text-slate-400 text-sm mt-1">{error || 'This topic may have been deleted or does not exist.'}</p>
        <Link to="/" className="mt-4 inline-block text-sm font-semibold text-indigo-400 hover:text-indigo-350 hover:underline">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  const isCreator = currentUser && currentUser._id === discussion.creator?._id;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center space-x-1.5 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Discussions</span>
      </button>

      {/* Main Discussion Thread Post */}
      <article className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl relative">
        <div className="flex flex-col gap-4">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/60 pb-4">
            <div className="flex items-center space-x-3 text-xs text-slate-400">
              <span className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/25 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px]">
                {discussion.category}
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5 text-slate-500" />
                <span>{formatDate(discussion.createdAt)}</span>
              </span>
            </div>

            {isCreator && (
              <button
                onClick={handleDeleteDiscussion}
                className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-900/50 bg-slate-950 px-3 py-1.5 rounded-lg font-medium transition-all"
                title="Delete Discussion"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Topic</span>
              </button>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
            {discussion.title}
          </h1>

          {/* Creator Profile */}
          <div className="flex items-center space-x-3 bg-slate-950/40 p-3 rounded-xl border border-slate-850 w-fit">
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase"
              style={{ backgroundColor: discussion.creator?.avatarColor || '#6366f1' }}
            >
              {discussion.creator?.username?.charAt(0) || '?'}
            </div>
            <div>
              <div className="text-xs text-slate-400">Posted by</div>
              <div className="text-sm font-semibold text-slate-200">{discussion.creator?.username || 'Deleted User'}</div>
            </div>
          </div>

          {/* Description Content */}
          <div className="text-slate-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap py-2 border-t border-slate-800/30">
            {discussion.description}
          </div>

          {/* Tags cloud */}
          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-4">
              <Tag className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              {discussion.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-950 border border-slate-800 text-slate-400 text-xs px-2.5 py-0.5 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>

      {/* Mode Navigation Tabs */}
      <div className="border-b border-slate-800 flex gap-4">
        <button
          onClick={() => setActiveTab('replies')}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'replies'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10'
              : 'border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          <MessageSquare className="h-4.5 w-4.5" />
          <span>Forum Discussion</span>
        </button>

        <button
          onClick={() => setActiveTab('chat')}
          className={`flex items-center space-x-2 py-3 px-4 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'chat'
              ? 'border-indigo-500 text-indigo-400 bg-indigo-950/10'
              : 'border-transparent text-slate-450 hover:text-slate-200'
          }`}
        >
          <MessageCircle className="h-4.5 w-4.5" />
          <span>Live Chat Room</span>
        </button>
      </div>

      {/* Render selected Mode View */}
      <div>
        {activeTab === 'replies' ? (
          <CommentSection discussionId={id} currentUser={currentUser} />
        ) : (
          <RealtimeChatSection discussionId={id} currentUser={currentUser} />
        )}
      </div>
    </div>
  );
};

export default DiscussionDetail;
