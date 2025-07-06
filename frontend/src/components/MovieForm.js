// frontend/src/components/MovieForm.js
import React, { useState } from 'react';

const MovieForm = ({ movie, onSubmit, onCancel }) => {
    const [title, setTitle] = useState(movie?.title || '');
    const [description, setDescription] = useState(movie?.description || '');
    const [releaseYear, setReleaseYear] = useState(movie?.releaseYear || '');
    const [genre, setGenre] = useState(movie?.genre || '');
    const [imageUrl, setImageUrl] = useState(movie?.imageUrl || '');
    const [movieLink, setMovieLink] = useState(movie?.movieLink || ''); // NEW: movieLink state
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Include movieLink in the submitted data
        await onSubmit({ title, description, releaseYear: parseInt(releaseYear), genre, imageUrl, movieLink });
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="form-card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <h2 className="text-2xl font-bold text-white mb-6 text-center">{movie ? 'Edit Movie' : 'Add New Movie'}</h2>
            <div className="form-group">
                <label className="form-label" htmlFor="title">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    className="form-input"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    rows="4"
                    className="form-textarea"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                ></textarea>
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="releaseYear">
                    Release Year
                </label>
                <input
                    type="number"
                    id="releaseYear"
                    className="form-input"
                    value={releaseYear}
                    onChange={(e) => setReleaseYear(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="genre">
                    Genre
                </label>
                <input
                    type="text"
                    id="genre"
                    className="form-input"
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label className="form-label" htmlFor="imageUrl">
                    Image URL (Optional)
                </label>
                <input
                    type="url"
                    id="imageUrl"
                    className="form-input"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </div>
            {/* NEW: Movie Link Input */}
            <div className="form-group mb-6">
                <label className="form-label" htmlFor="movieLink">
                    Movie Link (URL)
                </label>
                <input
                    type="url"
                    id="movieLink"
                    className="form-input"
                    placeholder="e.g., https://example.com/movie-stream"
                    value={movieLink}
                    onChange={(e) => setMovieLink(e.target.value)}
                />
            </div>
            <div className="flex-container justify-end space-x-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-secondary"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex-center">
                            <div className="loading-spinner-small"></div>
                            <span style={{ marginLeft: '0.5rem' }}>Saving...</span>
                        </div>
                    ) : (
                        movie ? 'Update Movie' : 'Add Movie'
                    )}
                </button>
            </div>
        </form>
    );
};

export default MovieForm;
