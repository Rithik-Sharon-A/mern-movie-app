import { useSelector } from 'react-redux'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import MoviesList from '../components/MoviesList'

const Home = () => {
  const { user, token } = useSelector((state) => state.auth)

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to IMDb Movies
      </Typography>

      <Paper sx={{ p: 3, mt: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Authentication Status
        </Typography>

        {user && token ? (
          <Box>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              ✅ <strong>Welcome back, {user.name}!</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {user.email} | Role: {user.role}
            </Typography>
            <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
              You have access to browse and {user.role === 'admin' ? 'manage' : 'view'} movies.
            </Typography>
          </Box>
        ) : (
          <Typography variant="body1" color="text.secondary">
            ❌ Not logged in. Please register or login to access the movie collection.
          </Typography>
        )}
      </Paper>

      <MoviesList />
    </Container>
  )
}

export default Home