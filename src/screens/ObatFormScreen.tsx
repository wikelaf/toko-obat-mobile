import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { storeObat, updateObat } from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';

const ObatFormScreen = ({ navigation, route }) => {
    const isEdit = route.params?.obat ? true : false;
    const obatData = route.params?.obat || {};

    const [loading, setLoading] = useState(false);
    const [nama, setNama] = useState('');
    const [stok, setStok] = useState('');
    const [hargaBeli, setHargaBeli] = useState('');
    const [hargaJual, setHargaJual] = useState('');
    const [expiredDate, setExpiredDate] = useState('');

    useEffect(() => {
        if (isEdit) {
            setNama(obatData.nama_obat);
            setStok(obatData.stok.toString());
            setHargaBeli(obatData.harga_beli.split('.')[0]); // Remove decimals
            setHargaJual(obatData.harga_jual.split('.')[0]);
            setExpiredDate(obatData.expired_date);
        }
    }, [isEdit]);

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            nama_obat: nama,
            stok: parseInt(stok),
            harga_beli: parseFloat(hargaBeli),
            harga_jual: parseFloat(hargaJual),
            expired_date: expiredDate || '2025-12-31', // Default for now
        };

        try {
            if (isEdit) {
                await updateObat(obatData.id_obat, payload);
                Alert.alert('Sukses', 'Data obat berhasil diperbarui');
            } else {
                await storeObat(payload);
                Alert.alert('Sukses', 'Data obat berhasil ditambahkan');
            }
            navigation.goBack();
        } catch (e) {
            console.log(e);
            Alert.alert('Error', 'Gagal menyimpan data obat');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Input label="Nama Obat" value={nama} onChangeText={setNama} placeholder="Contoh: Paracetamol" />
            <Input label="Stok" value={stok} onChangeText={setStok} placeholder="0" keyboardType="numeric" />
            <Input label="Harga Beli" value={hargaBeli} onChangeText={setHargaBeli} placeholder="0" keyboardType="numeric" />
            <Input label="Harga Jual" value={hargaJual} onChangeText={setHargaJual} placeholder="0" keyboardType="numeric" />
            <Input label="Tanggal Kadaluarsa (YYYY-MM-DD)" value={expiredDate} onChangeText={setExpiredDate} placeholder="2025-12-31" />

            <Button
                title={isEdit ? "Update Obat" : "Simpan Obat"}
                onPress={handleSubmit}
                loading={loading}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
    }
});

export default ObatFormScreen;
