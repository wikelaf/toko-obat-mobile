import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Alert } from 'react-native';

const API_URL = 'http://10.168.64.206:8000/api'; // Sinkronisasi dengan api.ts

interface AuthContextType {
    isLoading: boolean;
    userToken: string | null;
    userInfo: any;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<boolean>;
    updateProfile: (data: any) => Promise<boolean>;
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [userToken, setUserToken] = useState<string | null>(null);
    const [userInfo, setUserInfo] = useState<any>(null);

    const isLoggedIn = async () => {
        try {
            setIsLoading(true);
            let userToken = await AsyncStorage.getItem('userToken');
            let userInfo = await AsyncStorage.getItem('userInfo');

            if (userToken) {
                setUserToken(userToken);
                if (userInfo) setUserInfo(JSON.parse(userInfo));
            }
            setIsLoading(false);
        } catch (e) {
            console.log(`isLoggedIn error ${e}`);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login-pelanggan`, {
                email,
                password
            });

            console.log('Login response:', response.data);

            if (response.data.token) {
                const token = response.data.token;
                const user = response.data.pelanggan || response.data.user;

                setUserToken(token);
                setUserInfo(user);

                await AsyncStorage.setItem('userToken', token);
                await AsyncStorage.setItem('userInfo', JSON.stringify(user));
            } else {
                Alert.alert('Login Gagal', 'Token tidak ditemukan dalam respon.');
            }

        } catch (e: any) {
            console.log(e);
            Alert.alert('Login Gagal', e.response?.data?.message || 'Email atau password salah.');
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: any) => {
        setIsLoading(true);
        try {
            // Backend memerlukan password_confirmation untuk validasi
            const response = await axios.post(`${API_URL}/register-pelanggan`, {
                ...data,
                password_confirmation: data.password
            });

            if (response.data.token) {
                Alert.alert('Sukses', 'Registrasi berhasil! Silakan login.');
                return true;
            }
            return false;
        } catch (e: any) {
            console.log(e);
            Alert.alert('Registrasi Gagal', e.response?.data?.message || 'Terjadi kesalahan.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (data: any) => {
        setIsLoading(true);
        try {
            // Kita butuh ID dari userInfo atau token
            if (!userInfo?.id_pelanggan) {
                throw new Error("ID Pelanggan tidak ditemukan.");
            }

            const response = await axios.put(`${API_URL}/pelanggan/${userInfo.id_pelanggan}`, data);

            if (response.data.data) {
                const updatedUser = response.data.data;
                setUserInfo(updatedUser);
                await AsyncStorage.setItem('userInfo', JSON.stringify(updatedUser));
                Alert.alert('Sukses', 'Profil berhasil diperbarui!');
                return true;
            }
            return false;
        } catch (e: any) {
            console.log(e);
            Alert.alert('Gagal', e.response?.data?.message || 'Gagal memperbarui profil.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        setUserToken(null);
        setUserInfo(null);
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userInfo');
            // Opsional: panggil API logout jika diperlukan
        } catch (e) {
            console.log(`Logout error ${e}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ login, register, updateProfile, logout, isLoading, userToken, userInfo }}>
            {children}
        </AuthContext.Provider>
    );
};
