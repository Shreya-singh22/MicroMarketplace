import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (user) {
            fetchFavorites();
        } else {
            setFavorites([]);
        }
    }, [user]);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/favorites');
            setFavorites(response.data);
        } catch (error) {
            console.error('Fetch favorites error:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = async (productId) => {
        if (!user) {
            showToast('Please login to add favorites', 'info');
            return null;
        }
        try {
            const response = await axios.post('/favorites', { productId });
            const isFav = response.data.isFavorite; // Assumes backend returns { isFavorite: boolean }

            // Re-fetch to guarantee correct populated item state
            await fetchFavorites();

            showToast(isFav ? 'Added to favorites' : 'Removed from favorites', 'success');
            return isFav;
        } catch (error) {
            console.error('Toggle favorite error:', error);
            showToast('Failed to update favorite', 'error');
            return null;
        }
    };

    const isFavorite = (productId) => favorites.some(fav => fav.id === productId);

    return (
        <FavoritesContext.Provider value={{
            favorites,
            favoritesCount: favorites.length,
            loading,
            toggleFavorite,
            isFavorite,
            fetchFavorites
        }}>
            {children}
        </FavoritesContext.Provider>
    );
};
