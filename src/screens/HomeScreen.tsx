import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, ScrollView, Dimensions, Alert } from 'react-native';
import { getObats } from '../services/api';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Loading from '../components/Loading';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
    const [obats, setObats] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { cart, totalItems, addToCart, removeFromCart, updateQuantity } = useContext(CartContext);
    const { userInfo, logout } = useContext(AuthContext);

    const categories = [
        { id: 1, name: 'Vitamin', icon: '💊', color: '#e3f2fd' },
        { id: 2, name: 'Demam', icon: '🤒', color: '#fff3e0' },
        { id: 3, name: 'Luka', icon: '🩹', color: '#fce4ec' },
        { id: 4, name: 'Masker', icon: '😷', color: '#e8f5e9' },
    ];

    const fetchObats = async () => {
        setLoading(true);
        try {
            const response = await getObats();
            if (response.data && Array.isArray(response.data.data)) {
                setObats(response.data.data);
            } else if (response.data && Array.isArray(response.data)) {
                setObats(response.data);
            } else {
                setObats([]);
            }
        } catch (e) {
            console.log('Error fetching obats:', e);
            setObats([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchObats();
    }, []);

    const filteredObats = (obats || []).filter(obat => {
        const searchLower = search.toLowerCase();
        // Cari berdasarkan nama ATAU kategori
        const matchesSearch =
            obat?.nama_obat?.toLowerCase().includes(searchLower) ||
            obat?.kategori?.toLowerCase().includes(searchLower);

        const matchesCategory = selectedCategory
            ? (obat?.kategori?.toLowerCase() === selectedCategory.toLowerCase() ||
                obat?.nama_obat?.toLowerCase().includes(selectedCategory.toLowerCase()))
            : true;
        return matchesSearch && matchesCategory;
    });

    const handleCategoryPress = (categoryName: string) => {
        if (selectedCategory === categoryName) {
            setSelectedCategory(null); // Deselect jika diklik lagi
        } else {
            setSelectedCategory(categoryName);
        }
    };

    const handleAddToCart = (item: any) => {
        const success = addToCart(item);
        if (!success) {
            Alert.alert('Gagal', 'Stok tidak cukup');
        }
    };

    const getItemQuantity = (id_obat: number) => {
        const item = (cart || []).find(i => i.obat.id_obat === id_obat);
        return item ? item.jumlah : 0;
    };

    const handleUpdateQuantity = (obat: any, delta: number) => {
        const currentIndex = (cart || []).findIndex(i => i.obat.id_obat === obat.id_obat);
        if (currentIndex === -1) return;

        const newQty = cart[currentIndex].jumlah + delta;

        if (newQty <= 0) {
            removeFromCart(currentIndex);
        } else {
            const success = updateQuantity(currentIndex, newQty);
            if (!success && delta > 0) {
                Alert.alert('Gagal', 'Stok tidak cukup');
            }
        }
    };

    const renderHeader = () => (
        <View style={styles.contentHeader}>
            {/* Welcome Section */}
            <View style={styles.welcomeSection}>
                <View>
                    <Text style={styles.welcomeLabel}>Halo,</Text>
                    <Text style={styles.userName}>{userInfo ? userInfo.nama : 'Pelanggan Setia'}</Text>
                </View>
                <View style={styles.pointsContainer}>
                    <Text style={styles.pointsIcon}>💰</Text>
                    <Text style={styles.pointsText}>1.250 Poin</Text>
                </View>
            </View>

            {/* Quick Actions / Categories */}
            <View style={styles.categoryGrid}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[
                            styles.categoryItem,
                            selectedCategory === cat.name && styles.categoryItemActive
                        ]}
                        onPress={() => handleCategoryPress(cat.name)}
                    >
                        <View style={[
                            styles.categoryIconCircle,
                            { backgroundColor: cat.color },
                            selectedCategory === cat.name && styles.categoryIconCircleActive
                        ]}>
                            <Text style={styles.categoryIcon}>{cat.icon}</Text>
                        </View>
                        <Text style={[
                            styles.categoryName,
                            selectedCategory === cat.name && styles.categoryNameActive
                        ]}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Banner Section */}
            <View style={styles.bannerSection}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' }}
                    style={styles.bannerImage}
                />
                <View style={styles.bannerOverlay}>
                    <Text style={styles.bannerTitle}>Promo Akhir Tahun!</Text>
                    <Text style={styles.bannerSubtitle}>Diskon hingga 50% untuk vitamin</Text>
                </View>
            </View>

            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                    {selectedCategory ? `Kategori: ${selectedCategory}` : 'Semua Obat'}
                </Text>
                {selectedCategory && (
                    <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                        <Text style={styles.clearFilterText}>Hapus Filter</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    const renderItem = ({ item }: any) => {
        const fotoUrl = item.foto ? `http://10.168.64.206:8000/storage/${item.foto}` : null;
        const quantity = getItemQuantity(item.id_obat);

        return (
            <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate('ObatDetail', { obat: item })}
            >
                <View style={styles.productImageContainer}>
                    {fotoUrl ? (
                        <Image source={{ uri: fotoUrl }} style={styles.productImage} resizeMode="cover" />
                    ) : (
                        <View style={styles.productImagePlaceholder}>
                            <Text style={styles.placeholderIcon}>💊</Text>
                        </View>
                    )}
                </View>
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.nama_obat}</Text>
                    <Text style={styles.productPrice}>Rp {Math.floor(item.harga_jual).toLocaleString()}</Text>
                    <View style={styles.productFooter}>
                        <Text style={styles.productStock}>Stok: {item.stok}</Text>

                        {quantity === 0 ? (
                            <TouchableOpacity
                                style={styles.addButton}
                                onPress={() => handleAddToCart(item)}
                            >
                                <Text style={styles.addButtonText}>+</Text>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity
                                    style={styles.qtyButton}
                                    onPress={() => handleUpdateQuantity(item, -1)}
                                >
                                    <Text style={styles.qtyButtonText}>-</Text>
                                </TouchableOpacity>
                                <Text style={styles.qtyText}>{quantity}</Text>
                                <TouchableOpacity
                                    style={styles.qtyButton}
                                    onPress={() => handleUpdateQuantity(item, 1)}
                                >
                                    <Text style={styles.qtyButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header Sticky */}
            <View style={styles.stickyHeader}>
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari obat atau vitamin..."
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => navigation.navigate('Cart')}
                    >
                        <Text style={styles.headerEmoji}>🛒</Text>
                        {totalItems > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{totalItems > 9 ? '9+' : totalItems}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.authButton}
                        onPress={() => {
                            if (userInfo) {
                                Alert.alert('Logout', 'Apakah Anda yakin ingin keluar?', [
                                    { text: 'Batal', style: 'cancel' },
                                    { text: 'Ya, Keluar', onPress: () => logout() }
                                ]);
                            } else {
                                navigation.navigate('Login');
                            }
                        }}
                    >
                        <Text style={styles.authButtonText}>{userInfo ? 'Logout' : 'Login'}</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={filteredObats}
                keyExtractor={(item) => item.id_obat.toString()}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Tidak ada obat ditemukan</Text>
                    </View>
                }
            />

            <Loading visible={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    stickyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 45,
        paddingBottom: 15,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f5',
        borderRadius: 25,
        paddingHorizontal: 15,
        height: 40,
    },
    searchIcon: {
        fontSize: 14,
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    headerIcons: {
        flexDirection: 'row',
        marginLeft: 10,
    },
    iconButton: {
        marginLeft: 15,
        position: 'relative',
    },
    headerEmoji: {
        fontSize: 24,
    },
    authButton: {
        marginLeft: 15,
        backgroundColor: '#007bff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        justifyContent: 'center',
    },
    authButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#dc3545',
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    badgeText: {
        color: 'white',
        fontSize: 9,
        fontWeight: 'bold',
    },
    listContainer: {
        paddingBottom: 20,
    },
    contentHeader: {
        paddingTop: 20,
    },
    welcomeSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    welcomeLabel: {
        fontSize: 14,
        color: '#6c757d',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#212529',
    },
    pointsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        elevation: 2,
    },
    pointsIcon: {
        fontSize: 16,
        marginRight: 5,
    },
    pointsText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#495057',
    },
    categoryGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    categoryItem: {
        alignItems: 'center',
        width: (width - 40) / 4,
    },
    categoryItemActive: {
        // Bisa ditambahkan border atau shadow jika ingin seluruh item berubah
    },
    categoryIconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    categoryIcon: {
        fontSize: 24,
    },
    categoryName: {
        fontSize: 12,
        color: '#495057',
        fontWeight: '500',
    },
    categoryNameActive: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    categoryIconCircleActive: {
        borderWidth: 2,
        borderColor: '#007bff',
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginBottom: 15,
    },
    clearFilterText: {
        fontSize: 12,
        color: '#dc3545',
        fontWeight: '600',
    },
    bannerSection: {
        marginHorizontal: 20,
        height: 150,
        borderRadius: 15,
        overflow: 'hidden',
        marginBottom: 25,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    bannerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    bannerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bannerSubtitle: {
        color: 'white',
        fontSize: 12,
        opacity: 0.9,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#212529',
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 15,
    },
    productCard: {
        width: (width - 45) / 2,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        elevation: 3,
        overflow: 'hidden',
    },
    productImageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#f8f9fa',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    productImagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        fontSize: 40,
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#343a40',
        height: 40,
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007bff',
        marginBottom: 8,
    },
    productFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    productStock: {
        fontSize: 11,
        color: '#adb5bd',
    },
    addButton: {
        backgroundColor: '#007bff',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: -2,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f5',
        borderRadius: 20,
        paddingHorizontal: 5,
        height: 28,
    },
    qtyButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyButtonText: {
        fontSize: 18,
        color: '#007bff',
        fontWeight: 'bold',
    },
    qtyText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#343a40',
        marginHorizontal: 8,
        minWidth: 15,
        textAlign: 'center',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#adb5bd',
        fontSize: 14,
    },
});

export default HomeScreen;
