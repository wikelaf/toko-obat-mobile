import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/Card';
import Button from '../components/Button';

const CartScreen = ({ navigation }: any) => {
    const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useContext(CartContext);
    const { userToken } = useContext(AuthContext);

    const handleCheckout = () => {
        if (cart.length === 0) {
            Alert.alert('Keranjang Kosong', 'Tambahkan obat terlebih dahulu');
            return;
        }

        if (!userToken) {
            Alert.alert(
                'Login Diperlukan',
                'Silakan login terlebih dahulu untuk melanjutkan checkout',
                [
                    { text: 'Batal', style: 'cancel' },
                    { text: 'Login', onPress: () => navigation.navigate('Login') }
                ]
            );
        } else {
            navigation.navigate('Checkout');
        }
    };

    const handleUpdateQty = (index: number, delta: number) => {
        const newQty = cart[index].jumlah + delta;
        const success = updateQuantity(index, newQty);

        if (!success && newQty > 0) {
            Alert.alert('Gagal', 'Stok tidak mencukupi');
        }
    };

    const renderItem = ({ item, index }: any) => {
        const fotoUrl = item.obat.foto ? `http://10.168.64.206:8000/storage/${item.obat.foto}` : null;

        return (
            <Card style={styles.cartItem}>
                <View style={styles.itemRow}>
                    {/* Foto Produk */}
                    <View style={styles.imageContainer}>
                        {fotoUrl ? (
                            <Image source={{ uri: fotoUrl }} style={styles.productImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.placeholderIcon}>💊</Text>
                            </View>
                        )}
                    </View>

                    {/* Detail Produk */}
                    <View style={styles.itemDetails}>
                        <View style={styles.itemHeader}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.obat.nama_obat}</Text>
                            <TouchableOpacity onPress={() => removeFromCart(index)}>
                                <Text style={styles.deleteIcon}>🗑️</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.price}>Rp {Math.floor(item.obat.harga_jual).toLocaleString()}</Text>

                        <View style={styles.itemBody}>
                            <View style={styles.qtyControl}>
                                <TouchableOpacity
                                    style={styles.qtyButton}
                                    onPress={() => handleUpdateQty(index, -1)}
                                >
                                    <Text style={styles.qtyButtonText}>-</Text>
                                </TouchableOpacity>

                                <Text style={styles.qtyText}>{item.jumlah}</Text>

                                <TouchableOpacity
                                    style={styles.qtyButton}
                                    onPress={() => handleUpdateQty(index, 1)}
                                >
                                    <Text style={styles.qtyButtonText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.itemSubtotal}>Rp {item.subtotal.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>
            </Card>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={cart}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <View style={styles.emptyIconContainer}>
                            <Text style={styles.emptyIcon}>🛒</Text>
                        </View>
                        <Text style={styles.emptyTitle}>Keranjang Kosong</Text>
                        <Text style={styles.emptySub}>Sepertinya Anda belum menambahkan obat apapun ke keranjang.</Text>
                        <TouchableOpacity
                            style={styles.startShoppingButton}
                            onPress={() => navigation.navigate(userToken ? 'MainTabs' : 'Home', { screen: 'HomeTab' })}
                        >
                            <Text style={styles.startShoppingText}>Mulai Belanja Sekarang</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {cart.length > 0 && (
                <View style={styles.footer}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Pembayaran:</Text>
                        <Text style={styles.totalValue}>Rp {totalPrice.toLocaleString()}</Text>
                    </View>

                    <Button
                        title="Checkout"
                        onPress={handleCheckout}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    list: {
        padding: 15,
        paddingBottom: 150,
    },
    cartItem: {
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        elevation: 2,
    },
    itemRow: {
        flexDirection: 'row',
    },
    imageContainer: {
        width: 70,
        height: 70,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#f1f3f5',
        marginRight: 12,
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderIcon: {
        fontSize: 30,
    },
    itemDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    itemName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#343a40',
        flex: 1,
        marginRight: 10,
    },
    deleteIcon: {
        fontSize: 18,
    },
    price: {
        fontSize: 13,
        color: '#6c757d',
        marginTop: 2,
    },
    itemBody: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    qtyControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f3f5',
        borderRadius: 15,
        paddingHorizontal: 8,
        height: 30,
    },
    qtyButton: {
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    qtyButtonText: {
        color: '#007bff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    qtyText: {
        marginHorizontal: 12,
        fontSize: 14,
        fontWeight: 'bold',
        color: '#343a40',
        minWidth: 15,
        textAlign: 'center',
    },
    itemSubtotal: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#007bff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    emptyIcon: {
        fontSize: 60,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: 10,
    },
    emptySub: {
        fontSize: 14,
        color: '#6c757d',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    startShoppingButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        elevation: 3,
    },
    startShoppingText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    totalLabel: {
        fontSize: 16,
        color: '#495057',
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
    },
});

export default CartScreen;
