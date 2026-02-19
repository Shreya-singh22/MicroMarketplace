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
            await api.post('/favorites', { productId: parseInt(id as string) });
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />;
    }

    if (!product) {
        return (
            <View style={styles.container}>
                <Text>Product not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Image source={{ uri: product.imageUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.title}>{product.title}</Text>
                <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
                <Text style={styles.description}>{product.description}</Text>
                <TouchableOpacity
                    style={[styles.button, isFavorite ? styles.buttonActive : null]}
                    onPress={toggleFavorite}
                >
                    <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "red" : "white"} style={{ marginRight: 10 }} />
                    <Text style={[styles.buttonText, isFavorite ? { color: 'red' } : null]}>
                        {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    },
    info: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 20,
        color: '#007AFF',
        fontWeight: 'bold',
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007AFF',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 8,
    },
    buttonActive: {
        backgroundColor: '#ffebee',
        borderWidth: 1,
        borderColor: 'red',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
