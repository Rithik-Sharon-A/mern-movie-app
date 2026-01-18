import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

const initialState = {
  user: null,
  token: null,
  loading: false,
  error: null
}

// Helper function to decode JWT and extract user info
const decodeToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

// Helper function to load auth state from localStorage
const loadAuthState = () => {
  try {
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (token && user) {
      const decoded = decodeToken(token)
      if (decoded) {
        return {
          user: {
            ...JSON.parse(user),
            role: decoded.role
          },
          token,
          loading: false,
          error: null
        }
      }
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error)
  }

  return initialState
}

// Initialize state from localStorage
const preloadedState = loadAuthState()

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: preloadedState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.loading = false
      state.error = null

      // Persist to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.loading = false
      state.error = null

      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    }
  },
  extraReducers: (builder) => {
    // Register user
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        const decoded = decodeToken(action.payload.token)
        state.user = {
          ...action.payload.user,
          role: decoded?.role || 'user'
        }
        state.token = action.payload.token
        state.error = null

        // Persist to localStorage
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(state.user))
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Login user
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        const decoded = decodeToken(action.payload.token)
        state.user = {
          ...action.payload.user,
          role: decoded?.role || 'user'
        }
        state.token = action.payload.token
        state.error = null

        // Persist to localStorage
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(state.user))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  }
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer