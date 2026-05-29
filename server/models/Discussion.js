import mongoose from 'mongoose';

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a discussion title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a detailed description'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['General', 'Technology', 'Programming', 'Career Advice', 'Announcements', 'Support'],
      default: 'General',
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Discussion = mongoose.model('Discussion', discussionSchema);
export default Discussion;
