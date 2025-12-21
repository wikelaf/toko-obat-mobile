import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { getPenjualans } from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';

const PenjualanListScreen = ({ navigation }) => {
    const [penjualans, setPenjualans] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPenjualans = async () => {
        setLoading(true);
        try {
            const response = await getPenjualans();
            setPenjualans(response.data.data);
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Gagal memuat data penjualan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchPenjualans();
        });
        return unsubscribe;
    }, [navigation]);

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.date}>{item.tanggal}</Text>
                <Text style={styles.total}>Rp {parseInt(item.total_harga).toLocaleString()}</Text>
            </View>
            <Text>Pelanggan: {item.pelanggan?.nama || 'Umum'}</Text>
            <Text>Bayar: Rp {parseInt(item.bayar).toLocaleString()}</Text>
            <Text>Kembalian: Rp {parseInt(item.kembalian).toLocaleString()}</Text>
        </Card>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={penjualans}
                keyExtractor={(item) => item.id_penjualan.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={styles.empty}>Belum ada data penjualan</Text>}
            />
            <Loading visible={loading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    card: {
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    date: {
        fontWeight: 'bold',
        color: '#666',
    },
    total: {
        fontWeight: 'bold',
        color: '#007bff',
        fontSize: 16,
    },
    empty: {
        textAlign: 'center',
        marginTop: 50,
        color: '#666',
    }
});

export default PenjualanListScreen;
