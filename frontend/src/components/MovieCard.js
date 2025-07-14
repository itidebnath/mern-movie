
import React, { useState } from 'react';

const MovieCard = ({ movie, onEdit, onDelete, isAdmin }) => {
    const [showPlayer, setShowPlayer] = useState(false); // State to control player modal visibility

    // Function to get the correct embed URL for YouTube videos
    // This is a basic helper; for more robust handling, consider backend processing
    const getEmbedUrl = (url) => {
        if (!url) return '';
        // Basic YouTube watch link to embed link conversion
        if (url.includes('youtube.com/watch?v=')) {
            const videoId = url.split('v=')[1]?.split('&')[0];
            return `https: www.youtube.com/embed/${videoId}?autoplay=1`;   
        }
        // Add similar logic for other platforms if needed (e.g., Vimeo)
        return url; // Assume it's already an embeddable URL otherwise
    };

    const embedSrc = getEmbedUrl(movie.movieLink);

    return (
        <div className="movie-card">
            <img
                src={movie.imageUrl || `https: placehold.co/400x600/374151/FFFFFF?text=${encodeURIComponent(movie.title)}`}
                alt={movie.title}
                className="movie-card-image"
                onError={(e) => { e.target.onerror = null; e.target.src = `https: placehold.co/400x600/374151/FFFFFF?text=${encodeURIComponent(movie.title)}`; }}
            />
            <div className="movie-card-content">
                <h3 className="movie-card-title">{movie.title}</h3>
                <p className="movie-card-meta">{movie.genre} | {movie.releaseYear}</p>
                <p className="movie-card-description">{movie.description}</p>
                
                {movie.movieLink && (
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button
                            onClick={() => setShowPlayer(true)} // Open the player modal
                            className="btn btn-primary"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                        >
                            Watch Movie
                        </button>
                    </div>
                )}
                {isAdmin && (
                    <div className="movie-card-actions">
                        <button
                            onClick={() => onEdit(movie)}
                            className="btn btn-info text-sm"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(movie._id)}
                            className="btn btn-danger text-sm"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            
            {showPlayer && embedSrc && (
                <div className="movie-player-modal-overlay">
                    <div className="movie-player-modal-content">
                        <button onClick={() => setShowPlayer(false)} className="movie-player-close-btn">&times;</button>
                        <iframe
                            src={embedSrc}
                            title={movie.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="movie-player-iframe"
                        ></iframe>
                        <p className="text-sm text-gray-400 text-center mt-2">
                            Note: Some videos may not play due to embedding restrictions.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieCard;
