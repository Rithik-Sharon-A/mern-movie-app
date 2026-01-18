import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  rating: {
    type: Number
  },
  releaseDate: {
    type: Date
  },
  duration: {
    type: Number
  },
  poster: {
    type: String
  }
}, {
  timestamps: true
});

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;