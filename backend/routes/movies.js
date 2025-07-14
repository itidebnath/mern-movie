// backend/routes/movies.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Movie = require('../models/Movie');


router.get('/', protect, async (req, res) => {
    try {
        const keyword = req.query.search
            ? {
                $or: [
                    { title: { $regex: req.query.search, $options: 'i' } },
                    { description: { $regex: req.query.search, $options: 'i' } },
                    { genre: { $regex: req.query.search, $options: 'i' } },
                ],
            }
            : {};

        const movies = await Movie.find(keyword);
        res.json(movies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Add a new movie
// @route   POST /api/movies
// @access  Private
router.post('/', protect, async (req, res) => {
     
    const { title, description, releaseYear, genre, imageUrl, movieLink } = req.body;

    if (!title || !description || !releaseYear || !genre) {
        return res.status(400).json({ message: 'Please enter all required fields' });
    }

    try {
        const movie = new Movie({
            user: req.user._id, // Link movie to the logged-in user
            title,
            description,
            releaseYear,
            genre,
            imageUrl,
            movieLink, // Save the new field
        });

        const createdMovie = await movie.save();
        res.status(201).json(createdMovie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a movie
// @route   PUT /api/movies/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
     
    const { title, description, releaseYear, genre, imageUrl, movieLink } = req.body;

    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
            // Ensure the logged-in user owns this movie (optional, but good practice for admin-like features)
            if (movie.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this movie' });
            }

            movie.title = title || movie.title;
            movie.description = description || movie.description;
            movie.releaseYear = releaseYear || movie.releaseYear;
            movie.genre = genre || movie.genre;
            movie.imageUrl = imageUrl !== undefined ? imageUrl : movie.imageUrl; // Allow clearing image URL
            movie.movieLink = movieLink !== undefined ? movieLink : movie.movieLink; // NEW: Allow clearing movieLink

            const updatedMovie = await movie.save();
            res.json(updatedMovie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/:id', protect, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (movie) {
              
            if (movie.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this movie' });
            }

            await movie.deleteOne(); 
            res.json({ message: 'Movie removed' });
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
