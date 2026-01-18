import Movie from '../models/Movie.js';

// Get all movies with search, sort, and pagination
export const getAllMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { search = '', sortBy = 'title', order = 'asc' } = req.query;

    // Build search query
    let searchQuery = {};
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      searchQuery = {
        $or: [
          { title: searchRegex },
          { description: searchRegex }
        ]
      };
    }

    // Build sort options
    const allowedSortFields = ['title', 'rating', 'releaseDate', 'duration'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'title';
    const sortDirection = order === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortField] = sortDirection;

    // Execute query
    const movies = await Movie.find(searchQuery)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

    const totalMovies = await Movie.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalMovies / limit);

    res.json({
      movies,
      pagination: {
        currentPage: page,
        totalPages,
        totalMovies,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get all movies error:', error);
    res.status(500).json({
      message: 'Server error while fetching movies'
    });
  }
};

// Search movies by title or description
export const searchMovies = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: 'Search query parameter "q" is required'
      });
    }

    const searchRegex = new RegExp(q, 'i'); // Case insensitive

    const movies = await Movie.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex }
      ]
    }).sort({ title: 1 });

    res.json({
      movies,
      searchQuery: q,
      count: movies.length
    });
  } catch (error) {
    console.error('Search movies error:', error);
    res.status(500).json({
      message: 'Server error while searching movies'
    });
  }
};

// Get sorted movies
export const sortMovies = async (req, res) => {
  try {
    const { sortBy = 'title', sortOrder = 'asc' } = req.query;
    const allowedSortFields = ['title', 'rating', 'releaseDate', 'duration'];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        message: `Invalid sort field. Allowed fields: ${allowedSortFields.join(', ')}`
      });
    }

    const sortDirection = sortOrder === 'desc' ? -1 : 1;
    const sortOptions = {};
    sortOptions[sortBy] = sortDirection;

    const movies = await Movie.find().sort(sortOptions);

    res.json({
      movies,
      sortBy,
      sortOrder,
      count: movies.length
    });
  } catch (error) {
    console.error('Sort movies error:', error);
    res.status(500).json({
      message: 'Server error while sorting movies'
    });
  }
};

// Create a new movie
export const createMovie = async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      message: 'Movie created successfully',
      movie
    });
  } catch (error) {
    console.error('Create movie error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      message: 'Server error while creating movie'
    });
  }
};

// Update a movie
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found'
      });
    }

    res.json({
      message: 'Movie updated successfully',
      movie
    });
  } catch (error) {
    console.error('Update movie error:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid movie ID format'
      });
    }

    res.status(500).json({
      message: 'Server error while updating movie'
    });
  }
};

// Delete a movie
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      return res.status(404).json({
        message: 'Movie not found'
      });
    }

    res.json({
      message: 'Movie deleted successfully',
      deletedMovie: movie
    });
  } catch (error) {
    console.error('Delete movie error:', error);

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid movie ID format'
      });
    }

    res.status(500).json({
      message: 'Server error while deleting movie'
    });
  }
};