import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_URL = 'http://10.168.64.206:8000/api'; // Menggunakan IP spesial Android Emulator untuk localhost

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Opsional: Handle logout otomatis jika token expired
            console.log('Unauthorized, please login again.');
        }
        return Promise.reject(error);
    }
);

export const login = async (email: any, password: any) => {
    return api.post('/login', { email, password });
};

export const registerPelanggan = async (data: any) => {
    return api.post('/register-pelanggan', data);
}

export const getObats = async () => {
    return api.get('/obat');
}

export const getPelanggans = async () => {
    return api.get('/pelanggan');
}


export const storeObat = async (data: any) => {
    return api.post('/obat', data);
}

export const updateObat = async (id: any, data: any) => {
    return api.put(`/obat/${id}`, data);
}

export const deleteObat = async (id: any) => {
    return api.delete(`/obat/${id}`);
}

export const storePelanggan = async (data: any) => {
    return api.post('/pelanggan', data);
}

export const updatePelanggan = async (id: any, data: any) => {
    return api.put(`/pelanggan/${id}`, data);
}

export const getPenjualans = async () => {
    return api.get('/penjualan');
}

export const createPenjualan = async (data: any) => {
    return api.post('/penjualan', data);
}

export const getRiwayatPesanan = async (id: any) => {
    return api.get(`/penjualan/pelanggan/${id}`);
}

export const logout = async () => {
    return api.post('/logout');
}

export default api;
