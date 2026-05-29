import Comment from '../models/Comment.js';
import Discussion from '../models/Discussion.js';

// @desc    Add a comment to a discussion
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res) => {
  const { discussionId, content } = req.body;

  if (!discussionId || !content) {
    return res.status(400).json({ message: 'Discussion ID and comment content are required' });
  }

  try {
    const discussion = await Discussion.findById(discussionId);
    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    const comment = await Comment.create({
      discussion: discussionId,
      creator: req.user._id,
      content,
    });

    const populated = await Comment.findById(comment._id).populate('creator', 'username avatarColor');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all comments for a specific discussion
// @route   GET /api/comments/discussion/:id
// @access  Public
export const getCommentsByDiscussion = async (req, res) => {
  try {
    const comments = await Comment.find({ discussion: req.params.id })
      .populate('creator', 'username avatarColor bio')
      .sort({ createdAt: 1 }); // Chronological order

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if current user is comment creator
    if (comment.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this comment' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
