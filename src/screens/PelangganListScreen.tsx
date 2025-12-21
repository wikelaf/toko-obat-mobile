import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TextInput } from 'react-native';
import { getPelanggans } from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';

const PelangganListScreen = () => {
    const [pelanggans, setPelanggans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchPelanggans = async () => {
        setLoading(true);
        try {
            const response = await getPelanggans();
            setPelanggans(response.data.data);
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Gagal memuat data pelanggan');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPelanggans();
    }, []);

    const filtered = pelanggans.filter(p =>
        p.nama.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <View>
                <Text style={styles.name}>{item.nama}</Text>
                <Text>Telp: {item.telepon}</Text>
                <Text>Alamat: {item.alamat}</Text>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="Cari pelanggan..."
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id_pelanggan.toString()}
                renderItem={renderItem}
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
    search: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    card: {
        marginBottom: 10,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    }
});

export default PelangganListScreen;
