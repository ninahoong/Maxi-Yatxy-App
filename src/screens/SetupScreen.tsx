import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function SetupScreen() {
    const [playerCount, setPlayerCount] = useState(2);

    const increment = () => setPlayerCount(prev => (prev < 8 ? prev + 1 : 8)); // Maks 8 spillere
    const decrement = () => setPlayerCount(prev => (prev > 1 ? prev - 1 : 1)); // Minst 1 spiller

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Velg antall spillere</Text>

            <View style={styles.counterContainer}>
                <TouchableOpacity style={styles.button} onPress={decrement}>
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.playerCount}>{playerCount}</Text>
                <TouchableOpacity style={styles.button} onPress={increment}>
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>

            {/* NØKKELEN: Vi sender med `playerCount` i URL-en til /game */}
            <Link href={{ pathname: '/game', params: { players: playerCount } }} asChild>
                <TouchableOpacity style={styles.startButton}>
                    <Text style={styles.startButtonText}>Start Spill</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 40 },
    counterContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 60 },
    button: { backgroundColor: '#e0e0e0', width: 60, height: 60, justifyContent: 'center', alignItems: 'center', borderRadius: 30 },
    buttonText: { fontSize: 30, color: '#333' },
    playerCount: { fontSize: 48, fontWeight: 'bold', marginHorizontal: 40 },
    startButton: { backgroundColor: '#007AFF', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 10 },
    startButtonText: { color: 'white', fontSize: 20, fontWeight: 'bold' },
});