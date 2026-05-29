import Discussion from '../models/Discussion.js';
import Comment from '../models/Comment.js';
import Message from '../models/Message.js';

// @desc    Create a new discussion
// @route   POST /api/discussions
// @access  Private
export const createDiscussion = async (req, res) => {
  const { title, description, category, tags } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Title, description, and category are required' });
  }

  try {
    const discussion = await Discussion.create({
      title,
      description,
      category,
      tags: tags || [],
      creator: req.user._id,
    });

    // Populate creator details
    const populated = await Discussion.findById(discussion._id).populate('creator', 'username avatarColor bio');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all discussions with optional filtering/search
// @route   GET /api/discussions
// @access  Public
export const getDiscussions = async (req, res) => {
  const { category, search, tag } = req.query;
  let query = {};

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const discussions = await Discussion.find(query)
      .populate('creator', 'username avatarColor')
      .sort({ createdAt: -1 });

    // Include comments count dynamically for each discussion
    const discussionsWithCount = await Promise.all(
      discussions.map(async (disc) => {
        const count = await Comment.countDocuments({ discussion: disc._id });
        return {
          ...disc.toObject(),
          commentsCount: count,
        };
      })
    );

    res.json(discussionsWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single discussion details
// @route   GET /api/discussions/:id
// @access  Public
export const getDiscussionById = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id)
      .populate('creator', 'username avatarColor bio');

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a discussion
// @route   PUT /api/discussions/:id
// @access  Private
export const updateDiscussion = async (req, res) => {
  const { title, description, category, tags } = req.body;

  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if the user is the creator of the discussion
    if (discussion.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to update this discussion' });
    }

    discussion.title = title || discussion.title;
    discussion.description = description || discussion.description;
    discussion.category = category || discussion.category;
    discussion.tags = tags || discussion.tags;

    const updatedDiscussion = await discussion.save();
    const populated = await Discussion.findById(updatedDiscussion._id).populate('creator', 'username avatarColor bio');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a discussion
// @route   DELETE /api/discussions/:id
// @access  Private
export const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findById(req.params.id);

    if (!discussion) {
      return res.status(404).json({ message: 'Discussion not found' });
    }

    // Check if the user is the creator
    if (discussion.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User not authorized to delete this discussion' });
    }

    // Use deleteOne to trigger cascade delete or delete associated files manually
    await Discussion.deleteOne({ _id: discussion._id });
    
    // Cascading delete comments and messages linked to this discussion
    await Comment.deleteMany({ discussion: discussion._id });
    await Message.deleteMany({ discussion: discussion._id });

    res.json({ message: 'Discussion and associated comments/chat history deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
