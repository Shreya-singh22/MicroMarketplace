import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import { FaSearch, FaHeart, FaArrowRight, FaStar, FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuth();
    const { showToast } = useToast();
    const { addToCart } = useCart();
    const { isFavorite, toggleFavorite: contextToggleFavorite } = useFavorites();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, [page, search]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/products?page=${page}&limit=8&search=${search}`);
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching products:', error);
            showToast('Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleFavoriteClick = async (e, productId) => {
        e.preventDefault();
        await contextToggleFavorite(productId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            {!search && page === 1 && (
                <div className="relative bg-indigo-900 text-white overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                            alt="Shopping"
                            className="w-full h-full object-cover opacity-30"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-transparent"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 animate-fade-in">
                            Discover Unique <br />
                            <span className="text-indigo-400">Micro Finds</span>
                        </h1>
                        <p className="mt-4 text-xl text-gray-300 max-w-lg mb-8">
                            Explore our curated collection of premium items at unbeatable prices. From vintage tech to modern home decor.
                        </p>
                        <a href="#products" className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-indigo-900 bg-white hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            Shop Now <FaArrowRight className="ml-2" />
                        </a>
                    </div>
                </div>
            )}

            <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                        <p className="mt-1 text-gray-500">Hand-picked items just for you</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all shadow-sm group-hover:shadow-md bg-white"
                        />
                        <FaSearch className="absolute left-4 top-3.5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <Link to={`/product/${product.id}`} key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full transform hover:-translate-y-1">
                                    <div className="relative pt-[100%] overflow-hidden bg-gray-100">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.title}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                                        />
                                        <button
                                            onClick={(e) => handleFavoriteClick(e, product.id)}
                                            className={`absolute top-3 right-3 p-2.5 rounded-full shadow-md transition-all duration-300 transform hover:scale-110 z-10 ${isFavorite(product.id)
                                                ? 'bg-white text-red-500'
                                                : 'bg-white/90 text-gray-400 hover:text-red-500'
                                                }`}
                                        >
                                            <FaHeart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                                        </button>

                                        {/* Quick Add Overlay */}
                                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                            <button className="w-full bg-indigo-600 text-white py-2 rounded-lg font-medium shadow-lg hover:bg-indigo-700 transition-colors">
                                                View Details
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-5 flex-1 flex flex-col">
                                        <div className="flex items-center mb-2">
                                            <div className="flex text-yellow-400 text-xs gap-0.5">
                                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-300" />
                                            </div>
                                            <span className="text-xs text-gray-400 ml-2">(4.0)</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">{product.description}</p>
                                        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-50">
                                            <div className="flex flex-col">
                                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price</span>
                                                <span className="text-xl font-bold text-indigo-900">₹{product.price.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl font-medium text-gray-900">No products found</h3>
                                <p className="text-gray-500 mt-2">Try adjusting your search terms</p>
                            </div>
                        )}

                        {/* Pagination */}
                        <div className="flex justify-center mt-16 pb-12">
                            <nav className="flex items-center space-x-2 bg-white p-2 rounded-xl shadow-sm border border-gray-100">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="px-4 py-2 bg-indigo-50 text-indigo-600 font-bold rounded-lg">
                                    {page} <span className="text-indigo-300 font-normal mx-1">/</span> {totalPages}
                                </div>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
