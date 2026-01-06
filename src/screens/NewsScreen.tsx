import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, Dimensions, Linking, ActivityIndicator } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');

const NEWS_API_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.republika.co.id%2Frss%2Fgaya-hidup%2Finfo-sehat';

const NewsScreen = () => {
    const [newsData, setNewsData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNews = async () => {
        try {
            const response = await axios.get(NEWS_API_URL);
            if (response.data && response.data.status === 'ok') {
                setNewsData(response.data.items);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchNews();
    };

    const openNews = (link: string) => {
        Linking.openURL(link);
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.newsCard} onPress={() => openNews(item.link)}>
            <Image
                source={{ uri: item.enclosure?.link || 'https://via.placeholder.com/150' }}
                style={styles.newsImage}
            />
            <View style={styles.newsContent}>
                <Text style={styles.newsDate}>{new Date(item.pubDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.newsSummary} numberOfLines={2}>{item.description.replace(/<[^>]*>?/gm, '').trim()}</Text>
                <Text style={styles.readMore}>Baca selengkapnya...</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={styles.loadingText}>Memuat Berita...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Berita Kesehatan</Text>
                <Text style={styles.headerSubtitle}>Informasi terkini dari Republika Online</Text>
            </View>
            <FlatList
                data={newsData}
                keyExtractor={(item) => item.guid}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Tidak ada berita saat ini</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: '#6c757d',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 4,
    },
    listContainer: {
        padding: 20,
    },
    newsCard: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 20,
        elevation: 3,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    newsImage: {
        width: 120,
        height: '100%',
        minHeight: 120,
    },
    newsContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    newsDate: {
        fontSize: 10,
        color: '#007bff',
        fontWeight: '600',
        marginBottom: 4,
    },
    newsTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 4,
    },
    newsSummary: {
        fontSize: 12,
        color: '#6c757d',
        marginBottom: 8,
    },
    readMore: {
        fontSize: 11,
        color: '#007bff',
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 50,
    },
    emptyText: {
        color: '#adb5bd',
    }
});

export default NewsScreen;
