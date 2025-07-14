// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors'); // Import cors middleware

const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movies');

dotenv.config(); // Load environment variables from .env file

connectDB(); 

const app = express();

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(cors()); // Enable CORS for all routes

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

// Simple route for testing
app.get('/', (req, res) => {
    res.send('Movie API is running...');
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
