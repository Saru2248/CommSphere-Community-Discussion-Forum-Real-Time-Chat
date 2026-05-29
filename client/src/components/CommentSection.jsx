import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Trash2, Calendar } from 'lucide-react';
import { commentService } from '../services/api';

const CommentSection = ({ discussionId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [discussionId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await commentService.getByDiscussion(discussionId);
      setComments(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const data = await commentService.create({
        discussionId,
        content: newComment.trim(),
      });
      setComments([...comments, data]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      setError('Failed to post comment. Try again.');
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) return;

    try {
      await commentService.delete(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error(err);
      alert('Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-4">
        <MessageSquare className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-slate-100">Discussion Replies ({comments.length})</h3>
      </div>

      {error && (
        <div className="bg-red-950/20 border border-red-800 text-red-400 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div
            className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shrink-0 mt-0.5"
            style={{ backgroundColor: currentUser.avatarColor || '#6366f1' }}
          >
            {currentUser.username.charAt(0)}
          </div>
          <div className="flex-1 relative">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Reply to this topic..."
              rows={2}
              className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="absolute right-3 bottom-3 text-indigo-500 hover:text-indigo-400 disabled:text-slate-700 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-center">
          <span className="text-slate-400 text-sm">Please log in to participate in the discussion.</span>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 text-slate-500 text-sm">
          No replies yet. Be the first to start the conversation!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isCreator = currentUser && currentUser._id === comment.creator?._id;
            return (
              <div
                key={comment._id}
                className="flex gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800/60 hover:border-slate-850 transition-colors"
              >
                {/* Creator Avatar */}
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm uppercase shrink-0"
                  style={{ backgroundColor: comment.creator?.avatarColor || '#6366f1' }}
                >
                  {comment.creator?.username?.charAt(0) || '?'}
                </div>

                {/* Comment Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-slate-200">
                        {comment.creator?.username || 'Deleted User'}
                      </span>
                      <span className="text-slate-500 text-xs flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(comment.createdAt)}</span>
                      </span>
                    </div>

                    {isCreator && (
                      <button
                        onClick={() => handleDelete(comment._id)}
                        className="text-slate-500 hover:text-red-400 p-1 rounded-md transition-colors"
                        title="Delete comment"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-slate-350 text-sm leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
