import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from '../api/axios';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart(null);
        }
    }, [user]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Fetch cart error:', error);
            // showToast('Failed to load cart', 'error');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1) => {
        if (!user) {
            showToast('Please login to add items to cart', 'info');
            return;
        }
        try {
            await axios.post('/cart', { productId, quantity });
            showToast('Added to cart', 'success');
            fetchCart(); // Refresh cart
        } catch (error) {
            console.error('Add to cart error:', error);
            showToast('Failed to add to cart', 'error');
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            await axios.put(`/cart/${itemId}`, { quantity });
            fetchCart();
        } catch (error) {
            console.error('Update quantity error:', error);
            showToast('Failed to update quantity', 'error');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await axios.delete(`/cart/${itemId}`);
            showToast('Item removed from cart', 'success');
            fetchCart();
        } catch (error) {
            console.error('Remove from cart error:', error);
            showToast('Failed to remove item', 'error');
        }
    };

    const checkout = async () => {
        try {
            const response = await axios.post('/cart/checkout');
            showToast('Order placed successfully!', 'success');
            setCart(null); // Clear local cart state
            fetchCart();
            return response.data;
        } catch (error) {
            console.error('Checkout error:', error);
            showToast('Failed to place order', 'error');
            throw error;
        }
    };

    const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;
    const cartTotal = cart?.items?.reduce((total, item) => total + (item.product.price * item.quantity), 0) || 0;

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            addToCart,
            updateQuantity,
            removeFromCart,
            checkout,
            cartCount,
            cartTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};
