// frontend/src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import MovieForm from '../components/MovieForm';
import { getMovies, addMovie, updateMovie, deleteMovie } from '../api/movies';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [movies, setMovies] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchMovies = async () => {
        if (!user) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const data = await getMovies();
            setMovies(data);
        } catch (err) {
            console.error('Error fetching movies:', err);
            setMessage('Failed to fetch movies.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, [user]);

    const handleAddMovie = async (movieData) => {
        try {
            await addMovie(movieData);
            setMessage('Movie added successfully!');
            setMessageType('success');
            setShowForm(false);
            fetchMovies(); // Re-fetch movies to update the list
        } catch (error) {
            console.error('Error adding movie:', error);
            setMessage(`Error adding movie: ${error.response?.data?.message || error.message}`);
            setMessageType('error');
        }
    };

    const handleUpdateMovie = async (movieData) => {
        try {
            await updateMovie(editingMovie._id, movieData); // Use _id from MongoDB
            setMessage('Movie updated successfully!');
            setMessageType('success');
            setEditingMovie(null);
            setShowForm(false);
            fetchMovies(); // Re-fetch movies
        } catch (error) {
            console.error('Error updating movie:', error);
            setMessage(`Error updating movie: ${error.response?.data?.message || error.message}`);
            setMessageType('error');
        }
    };

    const handleDeleteMovie = async (id) => {
        // Implement a custom modal for confirmation instead of window.confirm
        const confirmed = window.confirm("Are you sure you want to delete this movie?");
        if (!confirmed) return;

        try {
            await deleteMovie(id);
            setMessage('Movie deleted successfully!');
            setMessageType('success');
            fetchMovies(); // Re-fetch movies
        } catch (error) {
            console.error('Error deleting movie:', error);
            setMessage(`Error deleting movie: ${error.response?.data?.message || error.message}`);
            setMessageType('error');
        }
    };

    const startEdit = (movie) => {
        setEditingMovie(movie);
        setShowForm(true);
    };

    const cancelForm = () => {
        setEditingMovie(null);
        setShowForm(false);
    };

    const MessageBox = ({ msg, type, onClose }) => {
        if (!msg) return null;
        const bgColorClass = type === 'error' ? 'error' : 'success';
        return (
            <div className={`message-box ${bgColorClass}`}>
                <span>{msg}</span>
                <button onClick={onClose} className="message-box-close-btn">&times;</button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="loading-spinner"></div>
                <p className="text-white text-lg" style={{ marginLeft: '1rem' }}>Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="container-main p-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">Admin Dashboard</h1>
            <div className="flex-container justify-between align-center mb-6">
                <p className="text-gray-300">Logged in as: <span className="font-semibold">{user?.email}</span></p>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn btn-success"
                >
                    {showForm ? 'Hide Form' : 'Add New Movie'}
                </button>
            </div>

            {showForm && (
                <MovieForm
                    movie={editingMovie}
                    onSubmit={editingMovie ? handleUpdateMovie : handleAddMovie}
                    onCancel={cancelForm}
                />
            )}

            <h2 className="text-3xl font-bold mb-6 text-purple-300">Your Movies</h2>
            {movies.length === 0 ? (
                <p className="text-gray-400 text-center text-lg">No movies added yet. Add one using the "Add New Movie" button!</p>
            ) : (
                <div className="grid-layout sm-cols-2 md-cols-3 lg-cols-4">
                    {movies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} onEdit={startEdit} onDelete={handleDeleteMovie} isAdmin={true} />
                    ))}
                </div>
            )}
            <MessageBox msg={message} type={messageType} onClose={() => setMessage('')} />
        </div>
    );
};

export default AdminDashboard;
