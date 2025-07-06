// frontend/src/api/movies.js
import axios from 'axios';

const API_URL = 'https://mern-movie-backend-a6va.onrender.com/api/movies';

const getAuthHeaders = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    return {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
    };
};

export const getMovies = async (search = '') => {
    const config = getAuthHeaders();
    const url = search ? `${API_URL}?search=${search}` : API_URL;
    const { data } = await axios.get(url, config);
    return data;
};

export const addMovie = async (movieData) => {
    const config = getAuthHeaders();
    const { data } = await axios.post(API_URL, movieData, config);
    return data;
};

export const updateMovie = async (id, movieData) => {
    const config = getAuthHeaders();
    const { data } = await axios.put(`${API_URL}/${id}`, movieData, config);
    return data;
};

export const deleteMovie = async (id) => {
    const config = getAuthHeaders();
    await axios.delete(`${API_URL}/${id}`, config);
};
