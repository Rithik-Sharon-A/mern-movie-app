import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Paper,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { fetchMovies, deleteMovie } from '../store/slices/moviesSlice'

const MoviesList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { movies, loading, error, pagination } = useSelector((state) => state.movies)
  const { user } = useSelector((state) => state.auth)

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('title')
  const [order, setOrder] = useState('asc')
  const [page, setPage] = useState(1)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, movie: null })

  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    dispatch(fetchMovies({ search, sortBy, order, page }))
  }, [dispatch, search, sortBy, order, page])

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
    setPage(1) // Reset to first page when searching
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
    setPage(1) // Reset to first page when sorting
  }

  const handleOrderChange = (event) => {
    setOrder(event.target.value)
    setPage(1) // Reset to first page when changing order
  }

  const handlePageChange = (event, value) => {
    setPage(value)
  }

  const handleDeleteClick = (movie) => {
    setDeleteDialog({ open: true, movie })
  }

  const handleDeleteConfirm = async () => {
    if (deleteDialog.movie) {
      try {
        await dispatch(deleteMovie(deleteDialog.movie._id))
      } catch (error) {
        // Error handled by Redux
      }
    }
    setDeleteDialog({ open: false, movie: null })
  }

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, movie: null })
  }

  if (loading && movies.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h2">
          Movies Collection
        </Typography>
        {isAdmin && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/admin/add-movie')}
          >
            Add Movie
          </Button>
        )}
      </Box>

      {/* Search and Sort Controls */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search movies"
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
              >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="rating">Rating</MenuItem>
                <MenuItem value="releaseDate">Release Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Order</InputLabel>
              <Select
                value={order}
                label="Order"
                onChange={handleOrderChange}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {pagination.totalMovies || 0} movies found
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && movies.length > 0 && (
        <Box display="flex" justifyContent="center" sx={{ mb: 2 }}>
          <CircularProgress size={30} />
        </Box>
      )}

      {movies.length === 0 && !loading ? (
        <Typography variant="body1" color="text.secondary" align="center">
          No movies found.
        </Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} key={movie._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {movie.title}
                    </Typography>
                    {movie.rating && (
                      <Typography variant="body2" color="text.secondary">
                        Rating: {movie.rating}/10
                      </Typography>
                    )}
                    {movie.releaseDate && (
                      <Typography variant="body2" color="text.secondary">
                        Release: {new Date(movie.releaseDate).getFullYear()}
                      </Typography>
                    )}
                    {movie.description && (
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {movie.description.length > 100
                          ? `${movie.description.substring(0, 100)}...`
                          : movie.description}
                      </Typography>
                    )}
                  </CardContent>
                  {isAdmin && (
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/admin/edit-movie/${movie._id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteClick(movie)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" sx={{ mt: 4, mb: 2 }}>
              <Pagination
                count={pagination.totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
              />
            </Box>
          )}
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete Movie</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{deleteDialog.movie?.title}"?
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default MoviesList