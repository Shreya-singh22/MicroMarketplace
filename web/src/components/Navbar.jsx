import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaHeart, FaUser, FaSignOutAlt, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-indigo-600 text-white p-2 rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
                                <FaShoppingBag className="text-xl" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                MicroMarket
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                            Home
                        </Link>
                        {user ? (
                            <>
                                <Link to="/favorites" className="text-gray-600 hover:text-red-500 font-medium transition-colors flex items-center gap-2">
                                    <FaHeart /> Favorites
                                </Link>
                                <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                                    <div className="flex items-center text-gray-700 font-medium">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-2">
                                            <FaUser />
                                        </div>
                                        {user.name}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                        title="Logout"
                                    >
                                        <FaSignOutAlt />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-indigo-600 text-white px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="text-gray-600 hover:text-indigo-600 p-2"
                        >
                            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 absolute w-full shadow-lg animate-fade-in">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link
                            to="/"
                            onClick={() => setIsMenuOpen(false)}
                            className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-indigo-50"
                        >
                            Home
                        </Link>
                        {user ? (
                            <>
                                <Link
                                    to="/favorites"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 hover:text-red-500 hover:bg-red-50"
                                >
                                    Favorites
                                </Link>
                                <div className="px-3 py-3 border-t border-gray-100 mt-2">
                                    <div className="flex items-center text-gray-700 font-medium mb-3">
                                        <FaUser className="mr-2 text-indigo-600" />
                                        {user.name}
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left flex items-center text-red-500 font-medium"
                                    >
                                        <FaSignOutAlt className="mr-2" /> Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-4 flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMenuOpen(false)}
                                    className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 shadow-md"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
