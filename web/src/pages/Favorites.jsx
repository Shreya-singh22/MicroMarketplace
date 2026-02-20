import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { FaHeart } from 'react-icons/fa';

import { useFavorites } from '../context/FavoritesContext';

const Favorites = () => {
    const { favorites, toggleFavorite, loading } = useFavorites();

    const removeFavorite = async (e, productId) => {
        e.preventDefault();
        await toggleFavorite(productId);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (favorites.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold mb-4 text-gray-700">No favorites yet</h2>
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 font-medium">Browse products</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Favorites</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {favorites.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden transform hover:-translate-y-1">
                        <Link to={`/product/${product.id}`}>
                            <div className="h-48 overflow-hidden">
                                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                            </div>
                        </Link>
                        <div className="p-4">
                            <Link to={`/product/${product.id}`}>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{product.title}</h3>
                            </Link>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-bold text-indigo-600">₹{product.price.toLocaleString('en-IN')}</span>
                                <button
                                    onClick={(e) => removeFavorite(e, product.id)}
                                    className="p-2 rounded-full text-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-300"
                                >
                                    <FaHeart className="w-6 h-6 animate-pulse" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Favorites;
