import React from 'react';
import { View, StyleSheet, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import Card from '../components/Card';

const OrderDetailScreen = ({ route, navigation }: any) => {
    const { order } = route.params;

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

    const renderPriceRow = (label: string, value: number, isTotal = false) => (
        <View style={[styles.priceRow, isTotal && styles.totalRow]}>
            <Text style={[styles.priceLabel, isTotal && styles.totalLabelText]}>{label}</Text>
            <Text style={[styles.priceValue, isTotal && styles.totalValueText]}>
                Rp {Math.floor(value).toLocaleString()}
            </Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Status Header */}
            <View style={styles.statusSection}>
                <View style={styles.statusHeader}>
                    <View style={styles.statusBadgeWrapper}>
                        <Text style={styles.statusBadgeText}>Pesanan Selesai</Text>
                    </View>
                    <Text style={styles.orderId}>ID: ORD-{order.id_penjualan}</Text>
                </View>
                <Text style={styles.dateText}>{formatDate(order.tanggal)}</Text>
                <Text style={styles.thanksText}>Terima kasih telah berbelanja di Farmasi!</Text>
            </View>

            {/* Alamat Pengiriman (Place holder based on business logic) */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>📍</Text>
                    <Text style={styles.sectionTitle}>Detail Pengiriman</Text>
                </View>
                <Card style={styles.card}>
                    <Text style={styles.customerName}>{order.pelanggan?.nama}</Text>
                    <Text style={styles.customerPhone}>{order.pelanggan?.telepon}</Text>
                    <Text style={styles.customerAddress}>{order.pelanggan?.alamat}</Text>
                </Card>
            </View>

            {/* Daftar Produk */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>📦</Text>
                    <Text style={styles.sectionTitle}>Rincian Produk</Text>
                </View>
                {(order.penjualan_details || order.penjualanDetails || []).map((item: any, index: number) => {
                    const fotoUrl = item.obat.foto ? `http://10.168.64.206:8000/storage/${item.obat.foto}` : null;
                    return (
                        <View key={index} style={styles.itemRow}>
                            <Image
                                source={fotoUrl ? { uri: fotoUrl } : { uri: 'https://via.placeholder.com/60' }}
                                style={styles.itemImage}
                            />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemName} numberOfLines={1}>{item.obat.nama_obat}</Text>
                                <Text style={styles.itemQty}>{item.jumlah} x Rp {Math.floor(item.harga_satuan).toLocaleString()}</Text>
                            </View>
                            <Text style={styles.itemSubtotal}>Rp {Math.floor(item.subtotal).toLocaleString()}</Text>
                        </View>
                    );
                })}
            </View>

            {/* Rincian Pembayaran */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionIcon}>💳</Text>
                    <Text style={styles.sectionTitle}>Rincian Pembayaran</Text>
                </View>
                <Card style={styles.card}>
                    <View style={styles.paymentMethodRow}>
                        <Text style={styles.paymentLabel}>Metode Pembayaran</Text>
                        <Text style={styles.paymentValue}>{order.metode_pembayaran || 'COD'}</Text>
                    </View>
                    <View style={styles.divider} />
                    {renderPriceRow('Total Harga Produk', order.total_harga - 12000)}
                    {renderPriceRow('Biaya Pengiriman', 10000)}
                    {renderPriceRow('Biaya Layanan', 2000)}
                    {renderPriceRow('Total Pembayaran', order.total_harga, true)}
                </Card>
            </View>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.reorderButton}
                    onPress={() => navigation.navigate('MainTabs', { screen: 'HomeTab' })}
                >
                    <Text style={styles.reorderText}>Beli Lagi</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f4f7',
    },
    statusSection: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 40,
        borderBottomWidth: 8,
        borderBottomColor: '#f1f3f5',
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    statusBadgeWrapper: {
        backgroundColor: '#00aa5b',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusBadgeText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    orderId: {
        color: '#6c757d',
        fontSize: 13,
        fontWeight: 'bold',
    },
    dateText: {
        color: '#495057',
        marginTop: 12,
        fontSize: 16,
        fontWeight: 'bold',
    },
    thanksText: {
        color: '#6c757d',
        marginTop: 4,
        fontSize: 13,
    },
    section: {
        paddingHorizontal: 16,
        marginTop: 20,
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
        color: '#212529',
    },
    card: {
        padding: 16,
        borderRadius: 16,
        elevation: 1,
        borderWidth: 0,
    },
    customerName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212529',
    },
    customerPhone: {
        fontSize: 14,
        color: '#6c757d',
        marginVertical: 4,
    },
    customerAddress: {
        fontSize: 14,
        color: '#495057',
        lineHeight: 20,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 16,
        marginBottom: 10,
        elevation: 1,
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
    },
    itemDetails: {
        flex: 1,
        marginLeft: 12,
        marginRight: 4,
    },
    itemName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212529',
    },
    itemQty: {
        fontSize: 13,
        color: '#6c757d',
        marginTop: 4,
    },
    itemSubtotal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#212529',
    },
    paymentMethodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    paymentLabel: {
        fontSize: 14,
        color: '#6c757d',
    },
    paymentValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#212529',
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f3f5',
        marginVertical: 12,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    priceLabel: {
        fontSize: 14,
        color: '#6c757d',
    },
    priceValue: {
        fontSize: 14,
        color: '#212529',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f3f5',
    },
    totalLabelText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#212529',
    },
    totalValueText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#00aa5b',
    },
    footer: {
        padding: 20,
        paddingBottom: 40,
    },
    reorderButton: {
        backgroundColor: '#00aa5b',
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 2,
    },
    reorderText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default OrderDetailScreen;
