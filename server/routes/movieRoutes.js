import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import {
  getAllMovies,
  searchMovies,
  sortMovies,
  createMovie,
  updateMovie,
  deleteMovie
} from '../controllers/movieController.js';

const router = express.Router();

// GET /movies - Get all movies
router.get('/', getAllMovies);

// GET /movies/search - Search movies
router.get('/search', searchMovies);

// GET /movies/sorted - Get sorted movies
router.get('/sorted', sortMovies);

// POST /movies - Create a new movie
router.post('/', authMiddleware, adminMiddleware, createMovie);

// PUT /movies/:id - Update a movie
router.put('/:id', authMiddleware, adminMiddleware, updateMovie);

// DELETE /movies/:id - Delete a movie
router.delete('/:id', authMiddleware, adminMiddleware, deleteMovie);

export default router;