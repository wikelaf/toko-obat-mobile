import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const RegisterScreen = ({ navigation }: any) => {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [alamat, setAlamat] = useState('');
    const [telepon, setTelepon] = useState('');
    const { register, isLoading } = useContext(AuthContext);

    const handleRegister = async () => {
        const success = await register({
            nama,
            email,
            password,
            alamat,
            telepon
        });

        if (success) {
            navigation.navigate('Login');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Daftar Akun Baru</Text>
                <Text style={styles.subtitle}>Lengkapi data diri Anda</Text>
            </View>

            <View style={styles.form}>
                <Input
                    label="Nama Lengkap"
                    value={nama}
                    onChangeText={setNama}
                    placeholder="John Doe"
                />
                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="nama@email.com"
                    keyboardType="email-address"
                />
                <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Minimal 6 karakter"
                    secureTextEntry
                />
                <Input
                    label="Alamat"
                    value={alamat}
                    onChangeText={setAlamat}
                    placeholder="Jl. Contoh No. 123"
                />
                <Input
                    label="Nomor Telepon"
                    value={telepon}
                    onChangeText={setTelepon}
                    placeholder="08123456789"
                    keyboardType="phone-pad"
                />

                <Button
                    title="Daftar"
                    onPress={handleRegister}
                    loading={isLoading}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
    },
    form: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
        elevation: 3,
    },
});

export default RegisterScreen;
