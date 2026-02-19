import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaArrowLeft, FaStar, FaShoppingCart, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const { user } = useAuth();
    const { showToast } = useToast();
    const [isFavorite, setIsFavorite] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProduct();
        if (user) {
            checkFavorite();
        }
    }, [id, user]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            showToast('Failed to load product details', 'error');
        } finally {
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        try {
            const response = await axios.get('/favorites');
            const favorites = response.data;
            setIsFavorite(favorites.some(fav => fav.id === parseInt(id)));
        } catch (error) {
            console.error('Error checking favorite:', error);
        }
    };

    const toggleFavorite = async () => {
        if (!user) {
            showToast('Please login to add favorites', 'info');
            return;
        }
        try {
            await axios.post('/favorites', { productId: parseInt(id) });
            setIsFavorite(!isFavorite);
            showToast(!isFavorite ? 'Added to favorites' : 'Removed from favorites', 'success');
        } catch (error) {
            console.error('Error toggling favorite:', error);
            showToast('Failed to update favorite', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (!product) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
                <Link to="/" className="text-indigo-600 hover:text-indigo-800 mt-4 inline-block">Return to Home</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors font-medium">
                    <FaArrowLeft className="mr-2" /> Back to Products
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        {/* Image Section */}
                        <div className="md:w-1/2 bg-gray-100 relative h-96 md:h-auto">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/600?text=No+Image'; }}
                            />
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{product.title}</h1>
                                    <div className="flex items-center mb-6">
                                        <div className="flex text-yellow-400 text-sm gap-1">
                                            <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-300" />
                                        </div>
                                        <span className="text-gray-500 ml-2 text-sm">(124 reviews)</span>
                                    </div>
                                </div>
                                <button
                                    onClick={toggleFavorite}
                                    className={`p-3 rounded-full transition-all duration-300 transform active:scale-90 shadow-sm border ${isFavorite
                                            ? 'bg-red-50 border-red-100 text-red-500'
                                            : 'bg-white border-gray-100 text-gray-400 hover:text-red-500 hover:border-red-100'
                                        }`}
                                >
                                    <FaHeart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            <div className="mb-8">
                                <span className="text-4xl font-bold text-indigo-900">₹{product.price.toLocaleString('en-IN')}</span>
                                <span className="ml-3 text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">In Stock</span>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-8 border-b border-gray-100 pb-8">
                                {product.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="flex items-center text-gray-600 gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                        <FaTruck />
                                    </div>
                                    <span className="text-sm font-medium">Free Delivery</span>
                                </div>
                                <div className="flex items-center text-gray-600 gap-3">
                                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                        <FaShieldAlt />
                                    </div>
                                    <span className="text-sm font-medium">2 Year Warranty</span>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-col sm:flex-row gap-4">
                                <button className="flex-1 bg-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 hover:-translate-y-1 flex items-center justify-center gap-2">
                                    <FaShoppingCart /> Add to Cart
                                </button>
                                <button className="flex-1 bg-white text-indigo-600 border-2 border-indigo-600 py-4 px-6 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors flex items-center justify-center">
                                    Buy Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
