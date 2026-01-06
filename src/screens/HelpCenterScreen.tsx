import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, LayoutAnimation, Platform, UIManager, Linking } from 'react-native';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

const faqData = [
    {
        question: 'Bagaimana cara memesan obat?',
        answer: 'Anda dapat mencari obat di halaman Beranda, menekan ikon "+" untuk menambahkan ke keranjang, lalu pergi ke keranjang untuk melakukan checkout.'
    },
    {
        question: 'Apakah obat di sini terjamin keasliannya?',
        answer: 'Ya, semua obat yang tersedia di aplikasi kami berasal dari distributor resmi dan telah melewati pengecekan kualitas.'
    },
    {
        question: 'Metode pembayaran apa saja yang tersedia?',
        answer: 'Saat ini kami mendukung berbagai metode pembayaran termasuk Transfer Bank, E-Wallet, dan Cash on Delivery (COD) pada wilayah tertentu.'
    },
    {
        question: 'Bagaimana cara melacak pesanan saya?',
        answer: 'Anda dapat melihat status pesanan Anda di tab "Pesanan" pada menu navigasi bawah.'
    },
    {
        question: 'Cara merubah informasi profil atau alamat?',
        answer: 'Buka tab "Akun", lalu tekan tombol "Edit" pada bagian Informasi Akun untuk merubah detail Anda.'
    },
    {
        question: 'Berapa lama estimasi waktu pengiriman?',
        answer: 'Pengiriman biasanya memakan waktu 1-5 jam kerja tergantung pada lokasi pengiriman Anda.'
    }
];

const FAQItem = ({ item }: { item: typeof faqData[0] }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <TouchableOpacity
            style={styles.faqItem}
            onPress={toggleExpand}
            activeOpacity={0.7}
        >
            <View style={styles.questionRow}>
                <Text style={styles.questionText}>{item.question}</Text>
                <Text style={styles.expandIcon}>{expanded ? '−' : '+'}</Text>
            </View>
            {expanded && (
                <View style={styles.answerRow}>
                    <Text style={styles.answerText}>{item.answer}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const HelpCenterScreen = () => {
    const handleContactCS = () => {
        const phoneNumber = '6281268012191'; // Format internasional (62 untuk Indonesia)
        const message = 'Halo Customer Service, saya ingin bertanya seputar aplikasi...';
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
        const webUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(webUrl);
            }
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Pusat Bantuan</Text>
                <Text style={styles.headerSubtitle}>Temukan jawaban atas pertanyaan Anda</Text>
            </View>

            <View style={styles.faqList}>
                {faqData.map((item, index) => (
                    <FAQItem key={index} item={item} />
                ))}
            </View>

            <View style={styles.contactSection}>
                <Text style={styles.contactTitle}>Masih butuh bantuan?</Text>
                <TouchableOpacity style={styles.contactButton} onPress={handleContactCS}>
                    <Text style={styles.contactButtonText}>Hubungi Customer Service (WA)</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#212529',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6c757d',
        marginTop: 5,
    },
    faqList: {
        marginBottom: 30,
    },
    faqItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 15,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    questionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
        paddingRight: 10,
    },
    expandIcon: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007bff',
    },
    answerRow: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f1f3f5',
    },
    answerText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    contactSection: {
        alignItems: 'center',
        paddingVertical: 20,
        backgroundColor: '#e3f2fd',
        borderRadius: 15,
    },
    contactTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#0d47a1',
        marginBottom: 15,
    },
    contactButton: {
        backgroundColor: '#007bff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
    },
    contactButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default HelpCenterScreen;
