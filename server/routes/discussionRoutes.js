import express from 'express';
import {
  createDiscussion,
  getDiscussions,
  getDiscussionById,
  updateDiscussion,
  deleteDiscussion,
} from '../controllers/discussionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createDiscussion)
  .get(getDiscussions);

router.route('/:id')
  .get(getDiscussionById)
  .put(protect, updateDiscussion)
  .delete(protect, deleteDiscussion);

export default router;
