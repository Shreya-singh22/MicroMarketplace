import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
}

export default function ProductDetails() {
    const { id } = useLocalSearchParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        fetchProduct();
        if (user) {
            checkFavorite();
        }
    }, [id, user]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const checkFavorite = async () => {
        try {
            const response = await api.get('/favorites');
            const favorites = response.data;
            setIsFavorite(favorites.some((fav: Product) => fav.id === parseInt(id as string)));
        } catch (error) {
            console.error(error);
        }
    };

    const toggleFavorite = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add favorites');
            return;
        }
        try {
            await api.post('/favorites', { productId: product.id });
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update favorite');
        }
    };

    const addToCart = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add to cart');
            return;
        }
        setAddingToCart(true);
        try {
            await api.post('/cart', { productId: product.id, quantity: 1 });
            Alert.alert('Success', 'Added to cart');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to add to cart');
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />;
    }

    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Product not found</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.detailsContainer}>
                <Image source={{ uri: product.imageUrl }} style={styles.image} />
                <View style={styles.info}>
                    <View style={styles.headerRow}>
                        <Text style={styles.title}>{product.title}</Text>
                        <TouchableOpacity onPress={toggleFavorite}>
                            <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={30} color={isFavorite ? "red" : "#666"} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.price}>₹{product.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
                    <Text style={styles.description}>{product.description}</Text>
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.addToCartButton, addingToCart && styles.disabledButton]}
                    onPress={addToCart}
                    disabled={addingToCart}
                >
                    {addingToCart ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <>
                            <Ionicons name="cart" size={20} color="white" style={{ marginRight: 8 }} />
                            <Text style={styles.addToCartText}>Add to Cart</Text>
                        </>
                    )}
                </TouchableOpacity>
                <TouchableOpacity style={styles.buyNowButton}>
                    <Text style={styles.buyNowText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loader: {
        marginTop: 50,
    },
    image: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    detailsContainer: {
        flex: 1,
    },
    info: {
        padding: 20,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        marginRight: 10,
    },
    price: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#4F46E5',
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        gap: 10,
        backgroundColor: 'white',
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#4F46E5',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buyNowButton: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#4F46E5',
    },
    addToCartText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buyNowText: {
        color: '#4F46E5',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.7,
    }
});
