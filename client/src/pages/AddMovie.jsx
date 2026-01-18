import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material'
import { createMovie } from '../store/slices/moviesSlice'

const AddMovie = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    rating: '',
    releaseDate: '',
    duration: '',
    poster: ''
  })

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state) => state.movies)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Convert rating to number and handle empty values
    const movieData = {
      ...formData,
      rating: formData.rating ? parseFloat(formData.rating) : undefined,
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      releaseDate: formData.releaseDate || undefined
    }

    // Remove empty fields
    Object.keys(movieData).forEach(key => {
      if (movieData[key] === undefined || movieData[key] === '') {
        delete movieData[key]
      }
    })

    try {
      const resultAction = await dispatch(createMovie(movieData))
      if (createMovie.fulfilled.match(resultAction)) {
        navigate('/')
      }
    } catch (error) {
      // Error is handled by Redux
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Movie
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          margin="normal"
          required
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Rating"
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          margin="normal"
          inputProps={{ min: 0, max: 10, step: 0.1 }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Release Date"
          name="releaseDate"
          type="date"
          value={formData.releaseDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Duration (minutes)"
          name="duration"
          type="number"
          value={formData.duration}
          onChange={handleChange}
          margin="normal"
          inputProps={{ min: 0 }}
          disabled={loading}
        />

        <TextField
          fullWidth
          label="Poster URL"
          name="poster"
          value={formData.poster}
          onChange={handleChange}
          margin="normal"
          disabled={loading}
        />

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Movie'}
          </Button>

          <Button
            variant="outlined"
            onClick={() => navigate('/')}
            disabled={loading}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default AddMovie