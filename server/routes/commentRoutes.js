import express from 'express';
import {
  createComment,
  getCommentsByDiscussion,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createComment);

router.route('/discussion/:id')
  .get(getCommentsByDiscussion);

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
