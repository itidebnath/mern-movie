// backend/models/Movie.js
const mongoose = require('mongoose');

const movieSchema = mongoose.Schema(
    {
        user: { // To link movies to the user who added them
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        releaseYear: {
            type: Number,
            required: true,
        },
        genre: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            default: '', // Optional image URL
        },
        // NEW FIELD: Movie Link
        movieLink: {
            type: String,
            default: '', // Optional movie streaming/embed link
        },
    },
    {
        timestamps: true,
    }
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
