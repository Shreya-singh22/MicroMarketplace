import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

const Checkout = () => {
    const { cartTotal, checkout } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Form, 2: Success
    const [formData, setFormData] = useState({
        fullName: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate processing delay
        setTimeout(async () => {
            try {
                await checkout();
                setStep(2);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }, 1500);
    };

    if (step === 2) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheckCircle className="text-green-500 text-4xl" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed!</h2>
                    <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been successfully placed and will be delivered shortly.</p>
                    <Link to="/" className="w-full block bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    const totalWithTax = (cartTotal * 1.18);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <Link to="/cart" className="inline-flex items-center text-gray-600 hover:text-indigo-600 mb-8 transition-colors font-medium">
                    <FaArrowLeft className="mr-2" /> Back to Cart
                </Link>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="p-8 border-b border-gray-100 bg-indigo-900 text-white">
                        <h1 className="text-2xl font-bold">Secure Checkout</h1>
                        <p className="text-indigo-200 mt-1">Complete your purchase securely</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Shipping Information</h2>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input required type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input required type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                                    <input required type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Payment Details</h2>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                    <input required type="text" placeholder="0000 0000 0000 0000" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <input required type="text" placeholder="MM/YY" name="expiry" value={formData.expiry} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                    <input required type="password" placeholder="123" name="cvv" value={formData.cvv} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-xl mb-8 flex justify-between items-center">
                            <span className="text-lg font-medium text-gray-700">Total to Pay</span>
                            <span className="text-2xl font-bold text-indigo-900">₹{totalWithTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                            ) : (
                                'Place Order'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
