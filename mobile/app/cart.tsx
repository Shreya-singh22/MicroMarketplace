import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import axios from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const fetchCart = async () => {
        if (!user) {
            setCart(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get('/cart');
            setCart(response.data);
        } catch (error) {
            console.error('Fetch cart error:', error);
            Alert.alert('Error', 'Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCart();
        }, [user])
    );

    const updateQuantity = async (itemId, quantity) => {
        try {
            await axios.put(`/cart/${itemId}`, { quantity });
            fetchCart();
        } catch (error) {
            Alert.alert('Error', 'Failed to update quantity');
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await axios.delete(`/cart/${itemId}`);
            fetchCart();
        } catch (error) {
            Alert.alert('Error', 'Failed to remove item');
        }
    };

    const checkout = async () => {
        try {
            await axios.post('/cart/checkout');
            Alert.alert('Success', 'Order placed successfully!');
            fetchCart();
        } catch (error) {
            Alert.alert('Error', 'Failed to place order');
        }
    };

    if (!user) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="cart-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Please login to view your cart</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#4F46E5" />
            </View>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <View style={styles.centerContainer}>
                <Ionicons name="cart-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>Your cart is empty</Text>
            </View>
        );
    }

    const cartTotal = cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

    const renderItem = ({ item }) => (
        <View style={styles.itemContainer}>
            <Image source={{ uri: item.product.imageUrl }} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={1}>{item.product.title}</Text>
                <Text style={styles.itemPrice}>₹{item.product.price.toLocaleString('en-IN')}</Text>

                <View style={styles.quantityContainer}>
                    <View style={styles.quantityControls}>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            style={styles.qtyButton}
                        >
                            <Ionicons name="remove" size={16} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            style={styles.qtyButton}
                        >
                            <Ionicons name="add" size={16} color="#333" />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                        <Ionicons name="trash-outline" size={20} color="red" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Shopping Cart</Text>
            <FlatList
                data={cart.items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
            />
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total:</Text>
                    <Text style={styles.totalAmount}>₹{cartTotal.toLocaleString('en-IN')}</Text>
                </View>
                <TouchableOpacity style={styles.checkoutButton} onPress={checkout}>
                    <Text style={styles.checkoutText}>Proceed to Buy</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 200,
    },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 16,
        marginBottom: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'space-between',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginTop: 4,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    qtyButton: {
        padding: 4,
    },
    quantityText: {
        paddingHorizontal: 12,
        fontWeight: '600',
        color: '#374151',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 40,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 18,
        color: '#374151',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    checkoutButton: {
        backgroundColor: '#4F46E5',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    checkoutText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
