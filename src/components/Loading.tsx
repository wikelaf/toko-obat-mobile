import React from 'react';
import { View, ActivityIndicator, StyleSheet, Modal } from 'react-native';

const Loading = ({ visible }) => {
    if (!visible) return null;

    return (
        <Modal transparent animationType="none" visible={visible}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#007bff" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10
    }
});

export default Loading;
