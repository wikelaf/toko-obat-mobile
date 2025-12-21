import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput } from 'react-native';
import { getObats, deleteObat } from '../services/api';
import Card from '../components/Card';
import Loading from '../components/Loading';

const ObatListScreen = ({ navigation }) => {
    const [obats, setObats] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');

    const fetchObats = async () => {
        setLoading(true);
        try {
            const response = await getObats();
            setObats(response.data.data); // Asumsi response: { data: [...] }
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Gagal memuat data obat');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchObats();
        });
        return unsubscribe;
    }, [navigation]);

    const handleDelete = (id) => {
        Alert.alert(
            'Hapus Obat',
            'Apakah anda yakin ingin menghapus obat ini?',
            [
                { text: 'Batal', style: 'cancel' },
                {
                    text: 'Hapus',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            setLoading(true);
                            await deleteObat(id);
                            fetchObats();
                        } catch (e) {
                            Alert.alert('Error', 'Gagal menghapus obat');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const filteredObats = obats.filter(obat =>
        obat.nama_obat.toLowerCase().includes(search.toLowerCase())
    );

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <View style={styles.cardContent}>
                <View>
                    <Text style={styles.name}>{item.nama_obat}</Text>
                    <Text>Stok: {item.stok}</Text>
                    <Text>Harga: Rp {parseInt(item.harga_jual).toLocaleString()}</Text>
                </View>
                <View style={styles.actions}>
                    <TouchableOpacity onPress={() => navigation.navigate('ObatForm', { obat: item })}>
                        <Text style={styles.editBtn}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(item.id_obat)}>
                        <Text style={styles.deleteBtn}>Hapus</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Card>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.search}
                placeholder="Cari obat..."
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={filteredObats}
                keyExtractor={(item) => item.id_obat.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('ObatForm')}
            >
                <Text style={styles.fabText}>+</Text>
            </TouchableOpacity>
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
    list: {
        paddingBottom: 80,
    },
    card: {
        marginBottom: 10,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    actions: {
        flexDirection: 'row',
    },
    editBtn: {
        color: '#007bff',
        marginRight: 15,
        fontWeight: 'bold',
    },
    deleteBtn: {
        color: '#e74a3b',
        fontWeight: 'bold',
    },
    fab: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#007bff',
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    fabText: {
        color: 'white',
        fontSize: 30,
        marginTop: -5,
    },
});

export default ObatListScreen;
