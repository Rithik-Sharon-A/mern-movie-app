# MERN Movie Management Dashboard

A full-stack web application for movie enthusiasts to browse, search, and manage movie collections with user authentication and role-based access control.

[![GitHub Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Rithik-Sharon-A/mern-movie-app)

## 📋 Description

This application provides a comprehensive movie management system built with the MERN stack (MongoDB, Express.js, React, Node.js). Users can browse movies from the IMDb Top 250 collection, while administrators have full CRUD capabilities to manage the movie database. The application features secure JWT-based authentication, role-based access control, and a responsive Material UI interface.

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **Material UI (MUI)** - React component library for professional UI
- **Redux Toolkit** - State management with RTK Query for async operations
- **React Router** - Client-side routing and navigation
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web framework for RESTful API development
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** - ODM for MongoDB data modeling
- **JWT (JSON Web Tokens)** - Secure authentication and authorization
- **bcryptjs** - Password hashing for security

## ✨ Features

### 🔐 User Authentication
- User registration and login
- JWT-based authentication with secure token storage
- Persistent login sessions across browser refreshes
- Password hashing with bcrypt

### 👥 Role-Based Access Control
- **Regular Users**: Browse movies, search, and view details
- **Administrators**: Full CRUD operations on movies
- Protected routes with automatic redirects

### 🎬 Movie Management
- **Browse Movies**: Display IMDb Top 250 movies in a responsive grid
- **Search Functionality**: Real-time search by title or description
- **Sorting Options**: Sort by title, rating, or release date
- **Pagination**: Efficient loading with configurable page sizes

### 🛡️ Admin Features
- Add new movies to the database
- Edit existing movie information
- Delete movies with confirmation dialogs
- Admin-only routes and UI elements

## 📁 Project Structure

```
mern-movie-app/
├── client/                          # React frontend
│   ├── src/
│   │   ├── api/                     # Axios configuration
│   │   ├── components/              # Reusable React components
│   │   ├── pages/                   # Page components (Login, Register, Home, etc.)
│   │   ├── store/                   # Redux store and slices
│   │   │   ├── slices/              # Redux Toolkit slices
│   │   │   └── store.js             # Store configuration
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # App entry point
│   ├── vite.config.js               # Vite configuration with proxy
│   └── package.json
├── server/                          # Node.js backend
│   ├── config/                      # Database configuration
│   ├── controllers/                 # Route controllers
│   ├── middleware/                  # Custom middleware (auth, CORS, errors)
│   ├── models/                      # Mongoose models
│   ├── routes/                      # API route definitions
│   ├── scripts/                     # Utility scripts (IMDb import)
│   ├── data/                        # Static data files
│   ├── app.js                       # Express app configuration
│   ├── server.js                    # Server entry point
│   └── package.json
└── README.md
```

## 🔧 Environment Variables Setup

Create the following environment files:

### server/.env
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=http://localhost:5173
```

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Update MongoDB connection string
   - Set a secure JWT secret

4. **Import IMDb movie data (optional):**
   ```bash
   npm run import-movies
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

### Access the Application

1. Open `http://localhost:5173` in your browser
2. Register a new account or login
3. Browse movies, use search and sorting features
4. Admin users can access CRUD operations via the "Add Movie" button

## 📡 API Endpoints Overview

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Movie Endpoints
- `GET /api/movies` - Get movies (with search, sort, pagination)
- `POST /api/movies` - Create movie (Admin only)
- `PUT /api/movies/:id` - Update movie (Admin only)
- `DELETE /api/movies/:id` - Delete movie (Admin only)

### Request/Response Examples

**Movie Search & Filtering:**
```
GET /api/movies?search=batman&sortBy=rating&order=desc&page=1
```

**Movie Creation:**
```json
POST /api/movies
{
  "title": "The Dark Knight",
  "description": "A thrilling superhero movie",
  "rating": 9.0,
  "releaseDate": "2008-07-18",
  "duration": 152,
  "poster": "https://example.com/poster.jpg"
}
```

## 🎭 IMDb Data Usage

This application includes a curated selection of movies inspired by IMDb's Top 250 list. The data is used for demonstration purposes and includes:

- Movie titles and descriptions
- IMDb ratings and metadata
- Poster URLs and release information

### Important Notes:
- **One-time import**: Use `npm run import-movies` to populate the database
- **Reference only**: Movie data is for educational purposes
- **No real-time sync**: Data is static and imported once
- **Admin management**: Administrators can add, edit, or remove movies

## 🏗️ Development vs Production

### Development
- **Vite Proxy**: Frontend requests to `/api/*` are automatically proxied to `http://localhost:5000`
- **Hot Reload**: Instant updates during development
- **Redux DevTools**: Enhanced debugging with Redux DevTools
- **Local CORS**: No CORS issues in development environment

### Production
- **Environment Variables**: Configure `CLIENT_URL` for your domain
- **CORS Configuration**: Backend allows requests from configured frontend URL
- **Build Optimization**: Vite creates optimized production builds
- **Security**: JWT secrets and database credentials properly configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using the MERN stack**