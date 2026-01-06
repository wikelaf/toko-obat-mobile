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
            'Konfirmasi Keluar',
            'Apakah Anda yakin ingin keluar dari aplikasi?',
            [
                { text: 'Batal', style: 'cancel' },
                { text: 'Ya, Keluar', onPress: () => logout(), style: 'destructive' }
            ]
        );
    };

    const handleSave = async () => {
        if (!nama || !email || !alamat || !telepon) {
            Alert.alert('Gagal', 'Semua bidang wajib diisi kecuali password');
            return;
        }

        const data: any = { nama, email, alamat, telepon };
        if (password) {
            if (password.length < 6) {
                Alert.alert('Gagal', 'Password minimal 6 karakter');
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
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
            {/* Elegant Header with Gradient effect using colors */}
            <View style={styles.headerBackground}>
                <TouchableOpacity
                    style={styles.helpButton}
                    onPress={() => navigation.navigate('HelpCenter')}
                >
                    <View style={styles.helpIconContainer}>
                        <Text style={styles.helpIconText}>?</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.profileHeader}>
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarGradient}>
                            <Text style={styles.avatarText}>
                                {userInfo?.nama ? userInfo.nama.charAt(0).toUpperCase() : 'U'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>{userInfo?.nama || 'Pengguna'}</Text>
                    <Text style={styles.userEmail}>{userInfo?.email || 'email@example.com'}</Text>
                </View>
            </View>

            <View style={styles.mainContent}>
                <Card style={styles.infoCard}>
                    <View style={styles.sectionHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.iconCircle}>
                                <Text style={{ fontSize: 16 }}>👤</Text>
                            </View>
                            <Text style={styles.sectionTitle}>Informasi Pribadi</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.editBtn, isEditing && styles.editBtnActive]}
                            onPress={() => setIsEditing(!isEditing)}
                        >
                            <Text style={[styles.editBtnText, isEditing && styles.editBtnTextActive]}>
                                {isEditing ? 'Batal' : 'Ubah'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {isEditing ? (
                        <View style={styles.editForm}>
                            <Input label="Nama Lengkap" value={nama} onChangeText={setNama} placeholder="Nama Anda" />
                            <Input label="Email" value={email} onChangeText={setEmail} placeholder="Email Anda" keyboardType="email-address" />
                            <Input label="Alamat" value={alamat} onChangeText={setAlamat} placeholder="Alamat Lengkap" multiline />
                            <Input label="No. Telepon" value={telepon} onChangeText={setTelepon} placeholder="Contoh: 0812..." keyboardType="phone-pad" />
                            <Input label="Password Baru" value={password} onChangeText={setPassword} placeholder="Kosongkan jika tidak ingin ganti" secureTextEntry />
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={isLoading}>
                                <Text style={styles.saveBtnText}>{isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.detailsList}>
                            <DetailRow label="No. Telepon" value={userInfo?.telepon || '---'} />
                            <DetailRow label="Alamat" value={userInfo?.alamat || '---'} />
                        </View>
                    )}
                </Card>

                <View style={styles.menuSection}>
                    <Text style={styles.menuLabel}>Aplikasi</Text>

                    <MenuLink
                        icon="📋"
                        title="Riwayat Pesanan"
                        subtitle="Cek status & detail pesanan Anda"
                        onPress={() => navigation.navigate('OrderHistory')}
                    />

                    <MenuLink
                        icon="🛡️"
                        title="Keamanan"
                        subtitle="Ubah kata sandi & pengaturan"
                        onPress={() => setIsEditing(true)}
                    />

                    <Text style={[styles.menuLabel, { marginTop: 20 }]}>Dukungan</Text>

                    <MenuLink
                        icon="❓"
                        title="Pusat Bantuan"
                        subtitle="Pertanyaan umum & cara penggunaan"
                        onPress={() => navigation.navigate('HelpCenter')}
                    />

                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <View style={styles.logoutIconCircle}>
                            <Text style={{ fontSize: 16 }}>🚪</Text>
                        </View>
                        <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const DetailRow = ({ label, value }: { label: string, value: string }) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
    </View>
);

const MenuLink = ({ icon, title, subtitle, onPress }: { icon: string, title: string, subtitle: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.menuLink} onPress={onPress}>
        <View style={styles.menuItemLeft}>
            <View style={styles.menuIconBox}>
                <Text style={{ fontSize: 18 }}>{icon}</Text>
            </View>
            <View>
                <Text style={styles.menuTitle}>{title}</Text>
                <Text style={styles.menuSubtitle}>{subtitle}</Text>
            </View>
        </View>
        <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f3f6',
    },
    contentContainer: {
        paddingBottom: 40,
    },
    headerBackground: {
        backgroundColor: '#007bff',
        paddingTop: 60,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        alignItems: 'center',
    },
    profileHeader: {
        alignItems: 'center',
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 15,
    },
    avatarGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'white',
    },
    avatarText: {
        fontSize: 40,
        color: 'white',
        fontWeight: 'bold',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: 'white',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
    userEmail: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    helpButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
    },
    helpIconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    helpIconText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    mainContent: {
        marginTop: -30,
        paddingHorizontal: 20,
    },
    infoCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#e7f1ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    editBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: '#f8f9fa',
    },
    editBtnActive: {
        backgroundColor: '#fff1f0',
    },
    editBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#007bff',
    },
    editBtnTextActive: {
        color: '#ff4d4f',
    },
    detailsList: {
        borderTopWidth: 1,
        borderTopColor: '#f1f3f5',
        paddingTop: 10,
    },
    detailRow: {
        marginVertical: 10,
    },
    detailLabel: {
        fontSize: 11,
        color: '#b2bec3',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        color: '#2d3436',
        fontWeight: '500',
    },
    editForm: {
        marginTop: 10,
    },
    saveBtn: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
    },
    saveBtnText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    menuSection: {
        marginTop: 30,
    },
    menuLabel: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#b2bec3',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 15,
        marginLeft: 5,
    },
    menuLink: {
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        elevation: 2,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f1f3f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    menuSubtitle: {
        fontSize: 12,
        color: '#b2bec3',
        marginTop: 2,
    },
    menuArrow: {
        fontSize: 20,
        color: '#dfe6e9',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        padding: 16,
        borderRadius: 16,
        backgroundColor: '#fff5f5',
        borderWidth: 1,
        borderColor: '#ffe3e3',
    },
    logoutIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#fee2e2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    logoutButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ff4d4f',
    }
});

export default ProfileScreen;
