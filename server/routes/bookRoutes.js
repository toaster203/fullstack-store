import express from 'express';
const router = express.Router();
import Book from '../models/bookModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { 
  getBooks, 
  getBookById,
  addBook,
  updateBook,
  deleteBook,
  createBookReview,
  getTopBooks } from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getBooks).post(protect, admin, addBook);
router.route('/:id/reviews').post(protect, createBookReview);
router.get('/top', getTopBooks);

router.route('/:id').get(getBookById).put(protect, admin, updateBook).delete(protect, admin, deleteBook);

export default router;