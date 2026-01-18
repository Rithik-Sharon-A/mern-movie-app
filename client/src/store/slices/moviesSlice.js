import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
  movies: [],
  loading: false,
  error: null,
  pagination: {}
}

// Async thunk for fetching movies
export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async ({ search = '', sortBy = 'title', order = 'asc', page = 1 }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        search,
        sortBy,
        order,
        page: page.toString()
      })

      const response = await api.get(`/movies?${params}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch movies')
    }
  }
)

// Async thunk for creating a movie
export const createMovie = createAsyncThunk(
  'movies/createMovie',
  async (movieData, { rejectWithValue }) => {
    try {
      const response = await api.post('/movies', movieData)
      return response.data.movie
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create movie')
    }
  }
)

// Async thunk for updating a movie
export const updateMovie = createAsyncThunk(
  'movies/updateMovie',
  async ({ id, movieData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/movies/${id}`, movieData)
      return response.data.movie
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update movie')
    }
  }
)

// Async thunk for deleting a movie
export const deleteMovie = createAsyncThunk(
  'movies/deleteMovie',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/movies/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete movie')
    }
  }
)

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false
        state.movies = action.payload.movies || []
        state.pagination = action.payload.pagination || {}
        state.error = null
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(createMovie.fulfilled, (state, action) => {
        // Optionally add the new movie to the list
        // state.movies.unshift(action.payload)
      })
      .addCase(updateMovie.fulfilled, (state, action) => {
        const index = state.movies.findIndex(movie => movie._id === action.payload._id)
        if (index !== -1) {
          state.movies[index] = action.payload
        }
      })
      .addCase(deleteMovie.fulfilled, (state, action) => {
        state.movies = state.movies.filter(movie => movie._id !== action.payload)
      })
  }
})

export default moviesSlice.reducer