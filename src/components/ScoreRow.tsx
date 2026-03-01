import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// VI OPPDATERER PROPS:
interface ScoreRowProps {
    label: string;
    scores: string[]; // Tar nå imot en liste med poeng
    onScoreChange: (playerIndex: number, value: string) => void; // Funksjon for å melde fra om endring
}

export default function ScoreRow({ label, scores, onScoreChange }: ScoreRowProps) {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>

            {/* VI MAPPER OVER LISTEN og lager et input-felt for hver poengsum */}
            {scores.map((score, index) => (
                <View key={index} style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="-"
                        value={score}
                        onChangeText={(text) => onScoreChange(index, text)} // Sender med spiller-indeks!
                        maxLength={3}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingLeft: 8, // Matcher header
    },
    label: {
        width: 100, // Matcher header
        fontSize: 18,
    },
    inputContainer: {
        flex: 1, // Matcher header
        alignItems: 'center',
        paddingHorizontal: 2, // Gir litt pusterom mellom boksene
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        width: '100%', // Fyller hele plassen den får av inputContainer
        textAlign: 'center',
        fontSize: 18,
        paddingVertical: 5,
    },
});