import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, TextInput, TouchableOpacity, Modal } from 'react-native';
import { getObats, getPelanggans, createPenjualan } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import Card from '../components/Card';

const PenjualanFormScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);

    // Data Master
    const [obats, setObats] = useState([]);
    const [pelanggans, setPelanggans] = useState([]);

    // Form State
    const [selectedPelanggan, setSelectedPelanggan] = useState(null);
    const [cart, setCart] = useState([]); // { obat, jumlah, subtotal }
    const [bayar, setBayar] = useState('');

    // Modals
    const [showObatModal, setShowObatModal] = useState(false);
    const [showPelangganModal, setShowPelangganModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [obatRes, pelangganRes] = await Promise.all([getObats(), getPelanggans()]);
            setObats(obatRes.data.data);
            setPelanggans(pelangganRes.data.data);
        } catch (e) {
            Alert.alert('Error', 'Gagal memuat data master');
        }
    };

    const addToCart = (obat) => {
        // Cek stok
        if (obat.stok <= 0) {
            Alert.alert('Stok Habis', 'Stok obat ini sudah habis');
            return;
        }

        const existingIndex = cart.findIndex(item => item.obat.id_obat === obat.id_obat);

        if (existingIndex >= 0) {
            const newCart = [...cart];
            if (newCart[existingIndex].jumlah + 1 > obat.stok) {
                Alert.alert('Stok limit', 'Jumlah melebihi stok tersedia');
                return;
            }
            newCart[existingIndex].jumlah += 1;
            newCart[existingIndex].subtotal = newCart[existingIndex].jumlah * parseFloat(obat.harga_jual);
            setCart(newCart);
        } else {
            setCart([...cart, {
                obat: obat,
                jumlah: 1,
                subtotal: parseFloat(obat.harga_jual)
            }]);
        }
        setShowObatModal(false);
    };

    const removeFromCart = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const totalHarga = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const kembalian = bayar ? parseFloat(bayar) - totalHarga : 0;

    const handleSubmit = async () => {
        if (!selectedPelanggan) {
            Alert.alert('Validasi', 'Pilih pelanggan terlebih dahulu');
            return;
        }
        if (cart.length === 0) {
            Alert.alert('Validasi', 'Keranjang belanja kosong');
            return;
        }
        if (parseFloat(bayar) < totalHarga) {
            Alert.alert('Validasi', 'Uang pembayaran kurang');
            return;
        }

        setLoading(true);
        const payload = {
            id_pelanggan: selectedPelanggan.id_pelanggan,
            tanggal: new Date().toISOString().split('T')[0],
            total_harga: totalHarga,
            bayar: parseFloat(bayar),
            kembalian: kembalian,
            items: cart.map(item => ({
                id_obat: item.obat.id_obat,
                jumlah: item.jumlah,
                harga_satuan: item.obat.harga_jual,
                subtotal: item.subtotal
            }))
        };

        try {
            await createPenjualan(payload);
            Alert.alert('Sukses', 'Transaksi berhasil disimpan');
            navigation.goBack();
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Gagal menyimpan transaksi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                {/* Pelanggan Section */}
                <Text style={styles.label}>Pelanggan</Text>
                <TouchableOpacity style={styles.selectBox} onPress={() => setShowPelangganModal(true)}>
                    <Text>{selectedPelanggan ? selectedPelanggan.nama : 'Pilih Pelanggan'}</Text>
                </TouchableOpacity>

                {/* Keranjang Section */}
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Keranjang Belanja</Text>
                    <TouchableOpacity onPress={() => setShowObatModal(true)}>
                        <Text style={styles.addText}>+ Tambah Obat</Text>
                    </TouchableOpacity>
                </View>

                {cart.map((item, index) => (
                    <Card key={index} style={styles.cartItem}>
                        <View style={styles.rowBetween}>
                            <Text style={styles.itemName}>{item.obat.nama_obat}</Text>
                            <TouchableOpacity onPress={() => removeFromCart(index)}>
                                <Text style={styles.deleteText}>Hapus</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.rowBetween}>
                            <Text>{item.jumlah} x {parseInt(item.obat.harga_jual).toLocaleString()}</Text>
                            <Text style={styles.subtotal}>Rp {item.subtotal.toLocaleString()}</Text>
                        </View>
                    </Card>
                ))}

                {/* Summary Section */}
                <View style={styles.summary}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalValue}>Rp {totalHarga.toLocaleString()}</Text>
                    </View>

                    <Input
                        label="Bayar (Rp)"
                        value={bayar}
                        onChangeText={setBayar}
                        keyboardType="numeric"
                        placeholder="0"
                    />

                    <View style={styles.rowBetween}>
                        <Text style={styles.totalLabel}>Kembalian:</Text>
                        <Text style={[styles.totalValue, { color: kembalian >= 0 ? 'green' : 'red' }]}>
                            Rp {kembalian.toLocaleString()}
                        </Text>
                    </View>
                </View>

                <Button
                    title="Simpan Transaksi"
                    onPress={handleSubmit}
                    loading={loading}
                    disabled={cart.length === 0}
                />
            </ScrollView>

            {/* Modal Pilih Pelanggan */}
            <Modal visible={showPelangganModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Pilih Pelanggan</Text>
                    <ScrollView>
                        {pelanggans.map(p => (
                            <TouchableOpacity
                                key={p.id_pelanggan}
                                style={styles.modalItem}
                                onPress={() => {
                                    setSelectedPelanggan(p);
                                    setShowPelangganModal(false);
                                }}
                            >
                                <Text style={styles.modalItemTitle}>{p.nama}</Text>
                                <Text>{p.alamat}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Button title="Tutup" type="secondary" onPress={() => setShowPelangganModal(false)} />
                </View>
            </Modal>

            {/* Modal Pilih Obat */}
            <Modal visible={showObatModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Pilih Obat</Text>
                    <ScrollView>
                        {obats.map(o => (
                            <TouchableOpacity
                                key={o.id_obat}
                                style={styles.modalItem}
                                onPress={() => addToCart(o)}
                            >
                                <View style={styles.rowBetween}>
                                    <Text style={styles.modalItemTitle}>{o.nama_obat}</Text>
                                    <Text>Stok: {o.stok}</Text>
                                </View>
                                <Text>Rp {Math.floor(o.harga_jual).toLocaleString()}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                    <Button title="Tutup" type="secondary" onPress={() => setShowObatModal(false)} />
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fc' },
    scroll: { padding: 20 },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 10 },
    selectBox: {
        padding: 15, backgroundColor: 'white', borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 10
    },
    rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    addText: { color: '#007bff', fontWeight: 'bold' },
    cartItem: { padding: 10 },
    itemName: { fontWeight: 'bold', fontSize: 16 },
    deleteText: { color: 'red' },
    subtotal: { fontWeight: 'bold' },
    summary: { marginTop: 20, marginBottom: 20, padding: 15, backgroundColor: '#e2e6ea', borderRadius: 10 },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },

    modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
    modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
    modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalItemTitle: { fontSize: 16, fontWeight: 'bold' }
});

export default PenjualanFormScreen;
