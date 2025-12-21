import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import Card from '../components/Card';

const ProfileScreen = ({ navigation }: any) => {
    const { userInfo, logout, updateProfile, isLoading } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);

    // Form states
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [alamat, setAlamat] = useState('');
    const [telepon, setTelepon] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (userInfo) {
            setNama(userInfo.nama || '');
            setEmail(userInfo.email || '');
            setAlamat(userInfo.alamat || '');
            setTelepon(userInfo.telepon || '');
            setPassword(''); // Reset password field
        }
    }, [userInfo]);

    const handleLogout = () => {
        Alert.alert(
            'Konfirmasi',
            'Apakah Anda yakin ingin keluar?',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Keluar', onPress: () => logout(), style: 'destructive' }
            ]
        );
    };

    const handleSave = async () => {
        if (!nama || !email || !alamat || !telepon) {
            Alert.alert('Error', 'Nama, Email, Alamat, dan Telepon harus diisi');
            return;
        }

        const data: any = {
            nama,
            email,
            alamat,
            telepon
        };

        if (password) {
            if (password.length < 6) {
                Alert.alert('Error', 'Password minimal 6 karakter');
                return;
            }
            data.password = password;
        }

        const success = await updateProfile(data);

        if (success) {
            setIsEditing(false);
            setPassword('');
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>
                        {userInfo?.nama ? userInfo.nama.charAt(0).toUpperCase() : 'U'}
                    </Text>
                </View>
                <Text style={styles.title}>{userInfo?.nama}</Text>
                <Text style={styles.subtitle}>{userInfo?.email}</Text>
            </View>

            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Informasi Akun</Text>
                    <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                        <Text style={styles.editButtonText}>
                            {isEditing ? 'Batal' : 'Edit'}
                        </Text>
                    </TouchableOpacity>
                </View>

                {isEditing ? (
                    <View style={styles.form}>
                        <Input
                            label="Nama Lengkap"
                            value={nama}
                            onChangeText={setNama}
                            placeholder="Nama Lengkap"
                        />
                        <Input
                            label="Email"
                            value={email}
                            onChangeText={setEmail}
                            placeholder="nama@email.com"
                            keyboardType="email-address"
                        />
                        <Input
                            label="Alamat"
                            value={alamat}
                            onChangeText={setAlamat}
                            placeholder="Alamat"
                            multiline
                        />
                        <Input
                            label="Nomor Telepon"
                            value={telepon}
                            onChangeText={setTelepon}
                            placeholder="0812..."
                            keyboardType="phone-pad"
                        />
                        <Input
                            label="Password Baru (Kosongkan jika tidak ganti)"
                            value={password}
                            onChangeText={setPassword}
                            placeholder="********"
                            secureTextEntry
                        />
                        <Button
                            title="Simpan Perubahan"
                            onPress={handleSave}
                            loading={isLoading}
                        />
                    </View>
                ) : (
                    <View style={styles.infoList}>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Nama</Text>
                            <Text style={styles.value}>{userInfo?.nama}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Email</Text>
                            <Text style={styles.value}>{userInfo?.email}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Alamat</Text>
                            <Text style={styles.value}>{userInfo?.alamat}</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Telepon</Text>
                            <Text style={styles.value}>{userInfo?.telepon}</Text>
                        </View>
                    </View>
                )}
            </Card>

            {!isEditing && (
                <>
                    <TouchableOpacity
                        style={styles.menuItem}
                        onPress={() => navigation.navigate('OrderHistory')}
                    >
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>📋</Text>
                            <Text style={styles.menuText}>Riwayat Pesanan</Text>
                        </View>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.menuItem, styles.logoutItem]}
                        onPress={handleLogout}
                    >
                        <View style={styles.menuLeft}>
                            <Text style={styles.menuIcon}>🚪</Text>
                            <Text style={[styles.menuText, styles.logoutText]}>Keluar</Text>
                        </View>
                    </TouchableOpacity>
                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f8f9fa',
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
        elevation: 4,
    },
    avatarText: {
        fontSize: 32,
        color: 'white',
        fontWeight: 'bold',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginBottom: 20,
        padding: 15,
        borderRadius: 15,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    editButtonText: {
        color: '#007bff',
        fontWeight: '600',
    },
    form: {
        marginTop: 5,
    },
    infoList: {
        marginTop: 5,
    },
    infoRow: {
        marginBottom: 15,
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    menuItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        elevation: 2,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 20,
        marginRight: 15,
    },
    menuText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    logoutItem: {
        marginTop: 10,
        borderColor: '#fee2e2',
        borderWidth: 1,
    },
    logoutText: {
        color: '#dc3545',
    },
    arrow: {
        fontSize: 24,
        color: '#ccc',
        marginTop: -5,
    },
});

export default ProfileScreen;
