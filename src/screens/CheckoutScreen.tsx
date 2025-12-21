import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, TouchableOpacity, Image, Dimensions, ActivityIndicator } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { createPenjualan } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';

const { width } = Dimensions.get('window');

const CheckoutScreen = ({ navigation }: any) => {
    const { cart, totalPrice, clearCart } = useContext(CartContext);
    const { userInfo } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');

    const paymentOptions = [
        { id: 'COD', name: 'Bayar di Tempat (COD)', icon: '💵' },
        { id: 'BANK', name: 'Transfer Bank', icon: '🏦' },
        { id: 'GOPAY', name: 'GoPay / OVO', icon: '📱' },
    ];

    const shippingFee = 10000;
    const adminFee = 2000;
    const grandTotal = totalPrice + shippingFee + adminFee;

    const handleCheckout = async () => {
        setLoading(true);

        const payload = {
            id_pelanggan: userInfo.id_pelanggan,
            tanggal: new Date().toISOString().slice(0, 19).replace('T', ' '),
            total_harga: grandTotal,
            bayar: grandTotal,
            kembalian: 0,
            metode_pembayaran: paymentMethod,
            items: cart.map(item => ({
                id_obat: item.obat.id_obat,
                jumlah: item.jumlah,
                harga_satuan: item.obat.harga_jual,
                subtotal: item.subtotal
            }))
        };

        try {
            const response = await createPenjualan(payload);
            clearCart();
            Alert.alert('Sukses', 'Pesanan berhasil dibuat!', [
                { text: 'OK', onPress: () => navigation.navigate('OrderDetail', { order: response.data.data }) }
            ]);
        } catch (e: any) {
            console.log(e);
            Alert.alert('Error', e.response?.data?.message || 'Gagal membuat pesanan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.mainContainer}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Alamat Pengiriman */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>📍</Text>
                        <Text style={styles.sectionTitle}>Alamat Pengiriman</Text>
                    </View>
                    <Card style={styles.addressCard}>
                        <Text style={styles.userName}>{userInfo?.nama}</Text>
                        <Text style={styles.userPhone}>{userInfo?.telepon}</Text>
                        <Text style={styles.userAddress}>{userInfo?.alamat}</Text>
                        <TouchableOpacity
                            style={styles.editAddress}
                            onPress={() => navigation.navigate('MainTabs', { screen: 'ProfileTab' })}
                        >
                            <Text style={styles.editAddressText}>Ubah</Text>
                        </TouchableOpacity>
                    </Card>
                </View>

                {/* Daftar Barang */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>📦</Text>
                        <Text style={styles.sectionTitle}>Rincian Pesanan</Text>
                    </View>
                    {cart.map((item, index) => {
                        const fotoUrl = item.obat.foto ? `http://10.168.64.206:8000/storage/${item.obat.foto}` : null;
                        return (
                            <View key={index} style={styles.itemRow}>
                                <Image
                                    source={fotoUrl ? { uri: fotoUrl } : { uri: 'https://via.placeholder.com/50' }}
                                    style={styles.itemImage}
                                />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemName} numberOfLines={1}>{item.obat.nama_obat}</Text>
                                    <View style={styles.itemPriceRow}>
                                        <Text style={styles.itemPrice}>Rp {Math.floor(item.obat.harga_jual).toLocaleString()}</Text>
                                        <Text style={styles.itemQty}>x{item.jumlah}</Text>
                                    </View>
                                </View>
                                <Text style={styles.itemSubtotal}>Rp {item.subtotal.toLocaleString()}</Text>
                            </View>
                        );
                    })}
                </View>

                {/* Metode Pembayaran */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>💳</Text>
                        <Text style={styles.sectionTitle}>Metode Pembayaran</Text>
                    </View>
                    {paymentOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.paymentOption,
                                paymentMethod === option.id && styles.paymentOptionActive
                            ]}
                            onPress={() => setPaymentMethod(option.id)}
                        >
                            <View style={styles.paymentLeft}>
                                <Text style={styles.paymentIcon}>{option.icon}</Text>
                                <Text style={styles.paymentName}>{option.name}</Text>
                            </View>
                            <View style={[
                                styles.radioCircle,
                                paymentMethod === option.id && styles.radioCircleActive
                            ]}>
                                {paymentMethod === option.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Ringkasan Pembayaran */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionIcon}>📝</Text>
                        <Text style={styles.sectionTitle}>Ringkasan Pembayaran</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Subtotal Produk</Text>
                        <Text style={styles.summaryValue}>Rp {totalPrice.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Biaya Pengiriman</Text>
                        <Text style={styles.summaryValue}>Rp {shippingFee.toLocaleString()}</Text>
                    </View>
                    <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Biaya Layanan</Text>
                        <Text style={styles.summaryValue}>Rp {adminFee.toLocaleString()}</Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                        <Text style={styles.totalLabel}>Total Pembayaran</Text>
                        <Text style={styles.totalValue}>Rp {grandTotal.toLocaleString()}</Text>
                    </View>
                </View>
            </ScrollView>

            {/* Sticky Bottom Button */}
            <View style={styles.footerSticky}>
                <View style={styles.footerPriceInfo}>
                    <Text style={styles.footerTotalLabel}>Total</Text>
                    <Text style={styles.footerTotalValue}>Rp {grandTotal.toLocaleString()}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.checkoutButton, loading && styles.disabledButton]}
                    onPress={handleCheckout}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.checkoutButtonText}>Buat Pesanan</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    container: {
        paddingBottom: 120,
    },
    section: {
        backgroundColor: 'white',
        marginTop: 10,
        padding: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionIcon: {
        fontSize: 18,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#343a40',
    },
    addressCard: {
        backgroundColor: '#fcfcfc',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#007bff',
        padding: 12,
    },
    userName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212529',
    },
    userPhone: {
        fontSize: 14,
        color: '#6c757d',
        marginVertical: 2,
    },
    userAddress: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    editAddress: {
        position: 'absolute',
        top: 12,
        right: 12,
    },
    editAddressText: {
        color: '#007bff',
        fontWeight: 'bold',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    itemImage: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: '#f1f3f5',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
    },
    itemName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#343a40',
    },
    itemPriceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 12,
        color: '#6c757d',
    },
    itemQty: {
        fontSize: 12,
        color: '#adb5bd',
        marginLeft: 8,
    },
    itemSubtotal: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#212529',
    },
    paymentOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f3f5',
    },
    paymentOptionActive: {
        backgroundColor: '#f0f7ff',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    paymentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        fontSize: 20,
        marginRight: 12,
    },
    paymentName: {
        fontSize: 14,
        color: '#495057',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#dee2e6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleActive: {
        borderColor: '#007bff',
    },
    radioInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#007bff',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#6c757d',
    },
    summaryValue: {
        fontSize: 14,
        color: '#212529',
    },
    totalRow: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#f1f3f5',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    footerSticky: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        elevation: 20,
    },
    footerPriceInfo: {
        flex: 1,
    },
    footerTotalLabel: {
        fontSize: 12,
        color: '#6c757d',
    },
    footerTotalValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    checkoutButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        minWidth: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#a5c9f5',
    },
    checkoutButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CheckoutScreen;
