
import React from 'react';
import { Link, useParams } from 'react-router-dom';

const categories = [
    'All', // Special category to show all movies
    'Action',
    'Comedy',
    'Drama',
    'Sci-Fi',
    'Horror',
    'Thriller',
    'Animation',
    'Family',
    'Documentary',
];

const CategoryNav = () => {
    const { genre } = useParams(); 

    return (
        <div className="category-nav">
            {categories.map((cat) => (
                <Link
                    key={cat}
                    to={cat === 'All' ? '/' : `/category/${cat}`}
                    className={`category-link ${genre === cat || (cat === 'All' && !genre) ? 'active' : ''}`}
                >
                    {cat}
                </Link>
            ))}
        </div>
    );
};

export default CategoryNav;
