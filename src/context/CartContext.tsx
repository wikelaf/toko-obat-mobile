import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CartItem {
    obat: any;
    jumlah: number;
    subtotal: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (obat: any, jumlah?: number) => boolean;
    removeFromCart: (index: number) => void;
    updateQuantity: (index: number, jumlah: number) => boolean;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

export const CartContext = createContext<CartContextType>({} as CartContextType);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart dari AsyncStorage saat app start
    useEffect(() => {
        loadCart();
    }, []);

    // Save cart ke AsyncStorage setiap kali berubah
    useEffect(() => {
        saveCart();
    }, [cart]);

    const loadCart = async () => {
        try {
            const savedCart = await AsyncStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        } catch (e) {
            console.log('Error loading cart:', e);
        }
    };

    const saveCart = async () => {
        try {
            await AsyncStorage.setItem('cart', JSON.stringify(cart));
        } catch (e) {
            console.log('Error saving cart:', e);
        }
    };

    const addToCart = (obat: any, jumlah: number = 1) => {
        const existingIndex = cart.findIndex(item => item.obat.id_obat === obat.id_obat);

        if (existingIndex >= 0) {
            // Update quantity jika sudah ada
            const newCart = [...cart];
            const newJumlah = newCart[existingIndex].jumlah + jumlah;

            // Cek stok
            if (newJumlah > obat.stok) {
                return false; // Gagal, stok tidak cukup
            }

            newCart[existingIndex].jumlah = newJumlah;
            newCart[existingIndex].subtotal = newJumlah * parseFloat(obat.harga_jual);
            setCart(newCart);
        } else {
            // Tambah item baru
            if (jumlah > obat.stok) {
                return false; // Gagal, stok tidak cukup
            }

            setCart([...cart, {
                obat: obat,
                jumlah: jumlah,
                subtotal: jumlah * parseFloat(obat.harga_jual)
            }]);
        }

        return true; // Berhasil
    };

    const removeFromCart = (index: number) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
    };

    const updateQuantity = (index: number, jumlah: number) => {
        const newCart = [...cart];
        const obat = newCart[index].obat;

        if (jumlah > obat.stok) {
            return false; // Gagal, stok tidak cukup
        }

        if (jumlah <= 0) {
            removeFromCart(index);
            return true;
        }

        newCart[index].jumlah = jumlah;
        newCart[index].subtotal = jumlah * parseFloat(obat.harga_jual);
        setCart(newCart);
        return true;
    };

    const clearCart = () => {
        setCart([]);
    };

    const totalItems = cart.reduce((sum, item) => sum + item.jumlah, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.subtotal, 0);

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            totalPrice
        }}>
            {children}
        </CartContext.Provider>
    );
};
