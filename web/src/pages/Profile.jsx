import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Link } from 'react-router-dom';
import { FaBox, FaArrowLeft, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';

const Profile = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                        <FaArrowLeft className="mr-2" /> Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
                    <div className="p-8 border-b border-gray-100 bg-indigo-900 text-white">
                        <h1 className="text-3xl font-bold">My Profile</h1>
                        <p className="text-indigo-200 mt-2 flex items-center gap-2">
                            Welcome back, {user?.name || user?.email}!
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <FaBox className="text-indigo-600" /> Order History
                        </h2>
                    </div>

                    <div className="p-8">
                        {orders.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FaBox className="text-gray-400 text-3xl" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                                <p className="text-gray-500 mb-6">Looks like you haven't placed any orders. Start shopping!</p>
                                <Link to="/" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                                    Browse Products
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {orders.map((order) => (
                                    <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-gray-50 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100">
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-sm">
                                                <div>
                                                    <p className="text-gray-500 font-medium mb-1">ORDER PLACED</p>
                                                    <p className="text-gray-900 flex items-center gap-1">
                                                        <FaCalendarAlt className="text-indigo-500" />
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-medium mb-1">TOTAL</p>
                                                    <p className="text-gray-900 font-semibold">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500 font-medium mb-1">SHIP TO</p>
                                                    <p className="text-indigo-600 font-medium cursor-pointer hover:underline">{user?.name || user?.email}</p>
                                                </div>
                                                <div className="sm:text-right">
                                                    <p className="text-gray-500 font-medium mb-1">ORDER #</p>
                                                    <p className="text-gray-900 text-xs sm:text-sm font-mono truncate">{order.id}-{Date.now().toString().slice(-4)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 sm:p-6">
                                            <div className="mb-4 flex items-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                                    <FaCheckCircle /> {order.status}
                                                </span>
                                            </div>
                                            <ul className="divide-y divide-gray-100">
                                                {order.items.map((item) => (
                                                    <li key={item.id} className="py-4 flex items-center">
                                                        <img
                                                            src={item.product?.imageUrl || 'https://via.placeholder.com/150'}
                                                            alt={item.product?.title || 'Product Image'}
                                                            className="h-20 w-20 flex-shrink-0 rounded-lg object-cover border border-gray-200"
                                                        />
                                                        <div className="ml-4 flex-1">
                                                            <div className="flex justify-between">
                                                                <h4 className="text-md font-bold text-gray-900">
                                                                    <Link to={`/product/${item.productId}`} className="hover:text-indigo-600">
                                                                        {item.product?.title || 'Unknown Product'}
                                                                    </Link>
                                                                </h4>
                                                                <p className="text-md font-medium text-gray-900">₹{item.price.toLocaleString('en-IN')}</p>
                                                            </div>
                                                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.product?.description}</p>
                                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                                <span className="font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-700">Qty: {item.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
