
const mongoose = require('mongoose');

const movieSchema = mongoose.Schema(
    {
        user: { 
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
            default: '', 
        },
        // NEW FIELD: Movie Link
        movieLink: {
            type: String,
            default: '', 
        },
    },
    {
        timestamps: true,
    }
);

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
