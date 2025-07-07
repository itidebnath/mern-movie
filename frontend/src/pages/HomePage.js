
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // NEW: Import useParams
import MovieCard from '../components/MovieCard';
import CategoryNav from '../components/CategoryNav';
import { getMovies } from '../api/movies';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
    const { user } = useAuth();
    const { genre } = useParams(); 
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            if (!user) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                setError('');
             
                const allMovies = await getMovies();
                setMovies(allMovies);

               
                if (genre && genre !== 'All') {
                    const genreFiltered = allMovies.filter(movie =>
                        movie.genre.toLowerCase() === genre.toLowerCase()
                    );
                    setFilteredMovies(genreFiltered);
                } else {
                    setFilteredMovies(allMovies); 
                }

            } catch (err) {
                console.error('Error fetching movies:', err);
                setError('Failed to fetch movies. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [user, genre]); 

    useEffect(() => {
       
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const currentMoviesToFilter = genre && genre !== 'All'
            ? movies.filter(movie => movie.genre.toLowerCase() === genre.toLowerCase())
            : movies;

        const results = currentMoviesToFilter.filter(movie =>
            movie.title.toLowerCase().includes(lowerCaseSearchTerm) ||
            movie.description.toLowerCase().includes(lowerCaseSearchTerm) ||
            movie.genre.toLowerCase().includes(lowerCaseSearchTerm)
        );
        setFilteredMovies(results);
    }, [searchTerm, movies, genre]); 

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '100vh' }}>
                <div className="loading-spinner"></div>
                <p className="text-white text-lg" style={{ marginLeft: '1rem' }}>Loading movies...</p>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8 text-lg">{error}</div>;
    }

    return (
        <div className="container-main p-4">
            <h1 className="text-4xl font-bold text-center mb-8 text-purple-400">
                {genre && genre !== 'All' ? `${genre} Movies` : 'All Movies'}
            </h1>

            
            <CategoryNav />

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search movies by title, description, or genre..."
                    className="form-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <h2 className="text-3xl font-bold mb-6 text-purple-300">
                {searchTerm ? `Search Results for "${searchTerm}"` : 'Browse Movies'}
            </h2>
            {filteredMovies.length === 0 ? (
                <p className="text-gray-400 text-center text-lg">
                    {searchTerm ? `No movies found matching "${searchTerm}".` : "No movies available. Check the Admin Dashboard to add some!"}
                </p>
            ) : (
                <div className="grid-layout sm-cols-2 md-cols-3 lg-cols-4">
                    {filteredMovies.map((movie) => (
                        <MovieCard key={movie._id} movie={movie} isAdmin={false} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
