import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaTrash, FaMinus, FaPlus, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const Cart = () => {
    const { cart, loading, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-2130356-1800917.png" alt="Empty Cart" className="w-64 mb-8 opacity-80" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-8 text-center max-w-md">Looks like you haven't added anything to your cart yet. Explore our products and find something you love!</p>
                <Link to="/" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-200">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-8">
                        <div className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100">
                            <ul className="divide-y divide-gray-100">
                                {cart.items.map((item) => (
                                    <li key={item.id} className="p-6 sm:flex items-center">
                                        <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.title}
                                                className="w-full h-full object-cover object-center"
                                            />
                                        </div>
                                        <div className="ml-6 flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex-1">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    <Link to={`/product/${item.product.id}`} className="hover:text-indigo-600">
                                                        {item.product.title}
                                                    </Link>
                                                </h3>
                                                <p className="mt-1 text-sm text-gray-500">{item.product.description.substring(0, 50)}...</p>
                                                <p className="mt-2 text-lg font-bold text-indigo-900">₹{item.product.price.toLocaleString('en-IN')}</p>
                                            </div>

                                            <div className="mt-4 sm:mt-0 flex items-center justify-between sm:flex-col sm:items-end gap-4">
                                                <div className="flex items-center border border-gray-200 rounded-lg">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="p-2 text-gray-600 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        <FaMinus size={12} />
                                                    </button>
                                                    <span className="px-4 py-1 text-gray-900 font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 text-gray-600 hover:text-indigo-600"
                                                    >
                                                        <FaPlus size={12} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-sm font-medium text-red-500 hover:text-red-700 flex items-center gap-1"
                                                >
                                                    <FaTrash size={14} /> Remove
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6 sticky top-24">
                            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between text-base text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-base text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between text-base text-gray-600">
                                    <span>Tax estimate</span>
                                    <span>₹{(cartTotal * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                                </div>
                                <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-gray-900">
                                    <span>Order Total</span>
                                    <span>₹{(cartTotal * 1.18).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="w-full mt-8 bg-indigo-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2"
                            >
                                Proceed to Checkout <FaArrowRight />
                            </button>

                            <div className="mt-6 text-center">
                                <Link to="/" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-center gap-1">
                                    <FaArrowLeft size={12} /> Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
