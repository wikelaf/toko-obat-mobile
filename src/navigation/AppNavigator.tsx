import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';

// Screens
import HomeScreen from '../screens/HomeScreen';
import ObatDetailScreen from '../screens/ObatDetailScreen';
import CartScreen from '../screens/CartScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import NewsScreen from '../screens/NewsScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const LoadingScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
    </View>
);

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#007bff',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: {
                    paddingBottom: 5,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{
                    title: 'Beranda',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>
                }}
            />
            <Tab.Screen
                name="NewsTab"
                component={NewsScreen}
                options={{
                    title: 'Berita',
                    headerShown: false,
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📰</Text>
                }}
            />
            <Tab.Screen
                name="OrderHistory"
                component={OrderHistoryScreen}
                options={{
                    title: 'Pesanan',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>📦</Text>
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    title: 'Akun',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>👤</Text>
                }}
            />
        </Tab.Navigator>
    );
};

const AppNavigator = () => {
    const { isLoading, userToken } = useContext(AuthContext);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                {userToken ? (
                    <Stack.Screen
                        name="MainTabs"
                        component={MainTabs}
                        options={{ headerShown: false }}
                    />
                ) : (
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                )}

                {/* Screens accessible from Home or Tabs */}
                <Stack.Screen
                    name="ObatDetail"
                    component={ObatDetailScreen}
                    options={{ title: 'Detail Obat' }}
                />
                <Stack.Screen
                    name="Cart"
                    component={CartScreen}
                    options={{ title: 'Keranjang Belanja' }}
                />
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Login' }}
                />
                <Stack.Screen
                    name="Register"
                    component={RegisterScreen}
                    options={{ title: 'Daftar Akun' }}
                />

                {/* Protected Stack - Hanya untuk user yang sudah login */}
                {userToken && (
                    <>
                        <Stack.Screen
                            name="Checkout"
                            component={CheckoutScreen}
                            options={{ title: 'Checkout' }}
                        />
                        <Stack.Screen
                            name="OrderDetail"
                            component={OrderDetailScreen}
                            options={{ title: 'Detail Pesanan' }}
                        />
                        <Stack.Screen
                            name="HelpCenter"
                            component={HelpCenterScreen}
                            options={{ title: 'Pusat Bantuan' }}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
