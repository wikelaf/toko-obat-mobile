import React, { useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getRiwayatPesanan } from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';

const OrderHistoryScreen = ({ navigation }: any) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { userInfo } = useContext(AuthContext);

    const fetchOrders = async () => {
        if (!userInfo?.id_pelanggan) return;

        setLoading(true);
        try {
            const response = await getRiwayatPesanan(userInfo.id_pelanggan);
            // Laravel riwayatByPelanggan mengembalikan array langsung
            setOrders(response.data || []);
        } catch (e: any) {
            console.log(e);
            Alert.alert('Error', 'Gagal memuat riwayat pesanan');
        } finally {
            setLoading(false);
        }
    };


    useFocusEffect(
        React.useCallback(() => {
            fetchOrders();
        }, [])
    );

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            const options: any = { day: 'numeric', month: 'short', year: 'numeric' };
            const d = date.toLocaleDateString('id-ID', options);
            const t = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            return `${d} • ${t}`;
        } catch (e) {
            return dateString;
        }
    };

    const renderItem = ({ item }: any) => {
        const details = item.penjualan_details || item.penjualanDetails || [];
        const itemCount = details.length || 0;
        const firstItem = details[0]?.obat || {};
        const firstItemName = firstItem.nama_obat || 'Produk';
        const fotoUrl = firstItem.foto ? `http://10.168.64.206:8000/storage/${firstItem.foto}` : null;

        return (
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate('OrderDetail', { order: item })}
                style={styles.cardContainer}
            >
                <Card style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.typeBadge}>
                            <Text style={styles.typeText}>💊 Farmasi</Text>
                        </View>
                        <Text style={styles.statusBadge}>Selesai</Text>
                    </View>

                    <View style={styles.cardBody}>
                        <View style={styles.imageWrapper}>
                            {fotoUrl ? (
                                <Image source={{ uri: fotoUrl }} style={styles.productImage} />
                            ) : (
                                <View style={styles.imagePlaceholder}>
                                    <Text style={styles.placeholderIcon}>💊</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.orderInfo}>
                            <Text style={styles.productName} numberOfLines={1}>
                                {firstItemName}
                            </Text>
                            <Text style={styles.itemCount}>
                                {itemCount} {itemCount > 1 ? 'items' : 'item'}
                            </Text>
                            <Text style={styles.orderDate}>{formatDate(item.tanggal)}</Text>
                        </View>

                        <View style={styles.priceSection}>
                            <Text style={styles.totalPrice}>
                                Rp {Math.floor(item.total_harga).toLocaleString()}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.cardFooter}>
                        <View style={styles.paymentMethod}>
                            <Text style={styles.paymentText}>
                                {item.metode_pembayaran === 'COD' ? '💵 Tunai' : '💳 Transfer'}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.reorderButton}
                            onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
                        >
                            <Text style={styles.reorderText}>Beli Lagi</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={orders}
                keyExtractor={(item) => item.id_penjualan.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconWrapper}>
                            <Text style={styles.emptyIcon}>📄</Text>
                        </View>
                        <Text style={styles.emptyTitle}>Belum ada pesanan</Text>
                        <Text style={styles.emptySub}>Ayo mulai belanja obat dan dapatkan poin!</Text>
                    </View>
                }
                onRefresh={fetchOrders}
                refreshing={loading}
            />
            <Loading visible={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f4f7',
    },
    list: {
        padding: 12,
    },
    cardContainer: {
        marginBottom: 12,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        backgroundColor: 'white',
        borderWidth: 0,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    typeBadge: {
        backgroundColor: '#fff',
        paddingHorizontal: 0,
    },
    typeText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#495057',
    },
    statusBadge: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#00aa5b', // Warna Hijau Grab
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    cardBody: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageWrapper: {
        width: 60,
        height: 60,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#f8f9fa',
        marginRight: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        fontSize: 24,
    },
    orderInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
        marginBottom: 2,
    },
    itemCount: {
        fontSize: 13,
        color: '#6c757d',
        marginBottom: 2,
    },
    orderDate: {
        fontSize: 12,
        color: '#adb5bd',
    },
    priceSection: {
        alignItems: 'flex-end',
    },
    totalPrice: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212529',
    },
    cardFooter: {
        marginTop: 16,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f3f5',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    paymentMethod: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentText: {
        fontSize: 12,
        color: '#6c757d',
        fontWeight: '500',
    },
    reorderButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#00aa5b',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },
    reorderText: {
        color: '#00aa5b',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 120,
        paddingHorizontal: 40,
    },
    emptyIconWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#e9ecef',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyIcon: {
        fontSize: 40,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 8,
    },
    emptySub: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        lineHeight: 20,
    },
});

export default OrderHistoryScreen;
