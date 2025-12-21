import React, { useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const ObatDetailScreen = ({ route, navigation }: any) => {
    const { obat } = route.params;
    const { addToCart } = useContext(CartContext);
    const [jumlah, setJumlah] = React.useState('1');

    // Backend mengembalikan path relatif (foto_obat/namafile.jpg)
    // Frontend menambahkan base URL storage
    const fotoUrl = obat.foto ? `http://10.168.64.206:8000/storage/${obat.foto}` : null;

    const handleAddToCart = () => {
        const qty = parseInt(jumlah);

        if (isNaN(qty) || qty <= 0) {
            Alert.alert('Error', 'Jumlah tidak valid');
            return;
        }

        const success = addToCart(obat, qty);

        if (success) {
            Alert.alert('Sukses', 'Obat ditambahkan ke keranjang', [
                { text: 'Lanjut Belanja', onPress: () => navigation.goBack() },
                { text: 'Lihat Keranjang', onPress: () => navigation.navigate('Cart') }
            ]);
        } else {
            Alert.alert('Gagal', 'Stok tidak mencukupi');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Foto Obat */}
            {fotoUrl ? (
                <Image
                    source={{ uri: fotoUrl }}
                    style={styles.obatImage}
                    resizeMode="cover"
                />
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Text style={styles.placeholderText}>📦</Text>
                    <Text style={styles.placeholderSubtext}>Tidak ada foto</Text>
                </View>
            )}

            <View style={styles.header}>
                <Text style={styles.name}>{obat.nama_obat}</Text>
                <Text style={styles.price}>Rp {Math.floor(obat.harga_jual).toLocaleString()}</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.label}>Stok Tersedia</Text>
                <Text style={styles.value}>{obat.stok} unit</Text>
            </View>

            <View style={styles.infoSection}>
                <Text style={styles.label}>Tanggal Kadaluarsa</Text>
                <Text style={styles.value}>{obat.expired_date}</Text>
            </View>

            <View style={styles.formSection}>
                <Input
                    label="Jumlah"
                    value={jumlah}
                    onChangeText={setJumlah}
                    keyboardType="numeric"
                    placeholder="1"
                />

                <Button
                    title="Tambah ke Keranjang"
                    onPress={handleAddToCart}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    obatImage: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        marginBottom: 20,
    },
    imagePlaceholder: {
        width: '100%',
        height: 250,
        borderRadius: 15,
        marginBottom: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 80,
        marginBottom: 10,
    },
    placeholderSubtext: {
        fontSize: 16,
        color: '#666',
    },
    header: {
        marginBottom: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    price: {
        fontSize: 28,
        color: '#007bff',
        fontWeight: 'bold',
    },
    infoSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
    },
    formSection: {
        marginTop: 30,
    },
});

export default ObatDetailScreen;
