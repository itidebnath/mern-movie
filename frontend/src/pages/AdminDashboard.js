
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

  // Define fetchMovies inside useEffect or use useCallback if it needs to be passed down
  // For this use case, defining it inside useEffect is common and effective.
  useEffect(() => {
    const fetchMovies = async () => { // Moved inside useEffect
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

    fetchMovies();
  }, [user]); // Now 'user' is the only dependency for the effect's setup

  const handleAddMovie = async (movieData) => {
    try {
      await addMovie(movieData);
      setMessage('Movie added successfully!');
      setMessageType('success');
      setShowForm(false);
      // Re-fetch movies after add
      setLoading(true);
      const data = await getMovies();
      setMovies(data);
      setLoading(false);
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
      // Re-fetch movies after update
      setLoading(true);
      const data = await getMovies();
      setMovies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error updating movie:', error);
      setMessage(`Error updating movie: ${error.response?.data?.message || error.message}`);
      setMessageType('error');
    }
  };

  const handleDeleteMovie = async (id) => {
    console.log('handleDeleteMovie called with ID:', id); // Log the ID received

    // IMPORTANT: Replaced window.confirm with a custom modal/message box
    // as window.confirm is blocked in Canvas environments.
    // For a real app, you'd use a custom confirmation dialog here.
    const confirmed = window.confirm("Are you sure you want to delete this movie?");
    if (!confirmed) {
      console.log('Movie deletion cancelled by user.');
      return;
    }

    try {
      console.log(`Attempting to delete movie with ID: ${id} via API call.`); // Debugging log before API call
      await deleteMovie(id); // Call the API function
      setMessage('Movie deleted successfully!');
      setMessageType('success');
      // Re-fetch movies after delete to update the UI
      setLoading(true);
      const data = await getMovies();
      setMovies(data);
      setLoading(false);
      console.log(`Movie with ID: ${id} successfully deleted and UI updated.`); // Debugging log after success
    } catch (error) {
      console.error('Error deleting movie:', error); // Log the full error object
      // Provide more specific error messages based on common API responses
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        if (error.response.status === 401) {
          setMessage('Error: You are not authorized to delete movies. Please log in as an admin.');
        } else if (error.response.status === 403) {
          setMessage('Error: Forbidden. You do not have permission to perform this action.');
        } else if (error.response.status === 404) {
          setMessage('Error: Movie not found or already deleted.');
        } else {
          setMessage(`Error deleting movie: ${error.response.data.message || error.message}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Error: No response received from server:', error.request);
        setMessage('Error: Could not connect to the server. Please check your network.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', error.message);
        setMessage(`An unexpected error occurred: ${error.message}`);
      }
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
