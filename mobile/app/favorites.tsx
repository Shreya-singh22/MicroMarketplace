import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

interface Product {
    id: number;
    title: string;
    price: number;
    imageUrl: string;
}

export default function Favorites() {
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { user } = useAuth();

    useEffect(() => {
        fetchFavorites();
    }, [user]); // Re-fetch when user changes (e.g., logout) or on mount

    const fetchFavorites = async () => {
        try {
            setLoading(true);
            const response = await api.get('/favorites');
            setFavorites(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (id: number) => {
        try {
            await api.post('/favorites', { productId: id });
            setFavorites(favorites.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
        }
    }

    const renderItem = ({ item }: { item: Product }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={{ flex: 1, flexDirection: 'row' }}
                onPress={() => router.push(`/product/${item.id}`)}
            >
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.price}>₹{item.price.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.removeButton}>
                <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
            ) : favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No favorites yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.list}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    list: {
        padding: 10,
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        marginBottom: 10,
        borderRadius: 10,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        alignItems: 'center',
        paddingRight: 10
    },
    image: {
        width: 80,
        height: 80,
    },
    info: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    loader: {
        marginTop: 50,
    },
    removeButton: {
        padding: 10
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyText: {
        fontSize: 18,
        color: '#666'
    }
});
