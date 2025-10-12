import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Velkommen til Maxi Yatzy</Text>

            {/* Link-komponenten navigerer til ruten definert av 'href' */}
            <Link href="/game" asChild>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Start Nytt Spill</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 40,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '500',
    },
});