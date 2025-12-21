import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const Button = ({ title, onPress, type = 'primary', loading = false, disabled = false }) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                type === 'secondary' ? styles.secondaryButton : styles.primaryButton,
                (disabled || loading) && styles.disabledButton,
            ]}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={type === 'secondary' ? '#007bff' : '#fff'} />
            ) : (
                <Text
                    style={[
                        styles.text,
                        type === 'secondary' ? styles.secondaryText : styles.primaryText,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    primaryButton: {
        backgroundColor: '#007bff',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#007bff',
    },
    disabledButton: {
        opacity: 0.6,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
    },
    primaryText: {
        color: '#fff',
    },
    secondaryText: {
        color: '#007bff',
    },
});

export default Button;
